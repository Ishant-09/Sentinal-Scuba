import { prisma } from '../../lib/prisma.js';
import { redis } from '../../lib/redis.js';
import { NotFoundError, BadRequestError } from '../../lib/errors.js';
import { xpService } from '../xp/xp.service.js';
import { emitToBoss, emitToGuild, emitToUser } from '../../realtime/emitters.js';

export const ABILITIES: Record<string, { base: number; cooldownSec: number }> = {
  'Index Surge': { base: 120, cooldownSec: 30 },
  'Hash Join Cleave': { base: 240, cooldownSec: 30 },
  'Query Optimization Ray': { base: 380, cooldownSec: 30 },
  'B-Tree Shatter Strike': { base: 500, cooldownSec: 30 }
};

export class BossService {
  async getCurrentBoss(userId: string) {
    let boss = await prisma.bossEncounter.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });

    if (!boss) {
      // Create default active boss
      boss = await prisma.bossEncounter.create({
        data: {
          guildId: 'shadow-protocol',
          name: 'THE QUERY DEVOURER',
          subtitle: 'An ancient corrupted index entity consuming database clusters across the realm.',
          difficulty: 'LEGENDARY',
          element: 'Void / Latency',
          lore: 'Spawned from an unindexed trillion-row JOIN disaster in subterranean server vaults. Only perfectly optimized relational spells can shatter its core.',
          phaseCount: 3,
          currentPhase: 2,
          currentHp: 6400,
          maxHp: 20000,
          status: 'ACTIVE',
          phases: [
            { number: 1, name: 'Phase 1 — Unindexed Depths', status: 'completed', bossHp: 0, bossMaxHp: 10000 },
            { number: 2, name: 'Phase 2 — The Join Labyrinth', status: 'active', bossHp: 6400, bossMaxHp: 20000 },
            { number: 3, name: 'Phase 3 — Transaction Deadlock', status: 'locked', bossHp: 30000, bossMaxHp: 30000 }
          ]
        }
      });
    }

    const phases = (Array.isArray(boss.phases) ? boss.phases : []) as any[];
    const currentPhaseObj = phases.find((p) => p.number === boss.currentPhase) || phases[0];
    const overallProgress = Math.round(((boss.maxHp - boss.currentHp) / boss.maxHp) * 100);

    return {
      id: boss.id,
      name: boss.name,
      subtitle: boss.subtitle,
      difficulty: boss.difficulty,
      overallProgress: Math.max(0, Math.min(100, overallProgress)),
      element: boss.element,
      lore: boss.lore,
      currentHp: boss.currentHp,
      maxHp: boss.maxHp,
      currentPhase: currentPhaseObj,
      phases
    };
  }

  async attackBoss(userId: string, abilityName: string) {
    const ability = ABILITIES[abilityName];
    if (!ability) {
      throw new BadRequestError(`Unknown attack ability: ${abilityName}`);
    }

    // 1. Enforce 30s Cooldown via Redis SET NX EX
    const cdKey = `cooldown:boss:${userId}:${abilityName}`;
    const acquired = await redis.set(cdKey, '1', 'EX', ability.cooldownSec, 'NX');
    if (!acquired) {
      throw new BadRequestError(`Ability on cooldown. Please wait before casting ${abilityName} again.`, 'COOLDOWN_ACTIVE');
    }

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    // Calculate XP earned in last 24h
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const xpEventsLast24h = await prisma.xpEvent.findMany({
      where: { userId, createdAt: { gte: dayAgo } }
    });
    const xpEarnedLast24h = xpEventsLast24h.reduce((acc, e) => acc + e.amount, 0);

    // Damage Formula: abilityBase + floor(level / 2) + floor(xpEarnedLast24h / 20)
    let damage = ability.base + Math.floor(user.level / 2) + Math.floor(xpEarnedLast24h / 20);
    const isCrit = Math.random() < 0.1; // 10% critical strike chance
    if (isCrit) {
      damage *= 2;
    }

    // 2. Atomic HP reduction inside Prisma transaction
    const updateResult = await prisma.$transaction(async (tx) => {
      const boss = await tx.bossEncounter.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' }
      });

      if (!boss) throw new NotFoundError('No active boss encounter');

      const nextHp = Math.max(0, boss.currentHp - damage);
      const phases = (Array.isArray(boss.phases) ? boss.phases : []) as any[];

      // Phase threshold check
      let newPhase = boss.currentPhase;
      let phaseChanged = false;
      let defeated = false;

      if (nextHp === 0) {
        defeated = true;
      } else if (nextHp < 5000 && boss.currentPhase === 2) {
        newPhase = 3;
        phaseChanged = true;
      }

      // Update phases array state
      const updatedPhases = phases.map((p) => {
        if (p.number === boss.currentPhase) {
          return { ...p, bossHp: nextHp };
        }
        if (phaseChanged && p.number === newPhase) {
          return { ...p, status: 'active' };
        }
        return p;
      });

      const updatedBoss = await tx.bossEncounter.update({
        where: { id: boss.id },
        data: {
          currentHp: nextHp,
          currentPhase: newPhase,
          status: defeated ? 'DEFEATED' : 'ACTIVE',
          phases: updatedPhases,
          defeatedAt: defeated ? new Date() : undefined
        }
      });

      const raidLog = await tx.bossRaidLog.create({
        data: {
          bossId: boss.id,
          userId,
          action: abilityName,
          damage,
          phaseAtHit: boss.currentPhase,
          isCrit,
          message: `${user.name} struck with ${abilityName} for ${damage} damage!${isCrit ? ' (CRITICAL HIT!)' : ''}`
        }
      });

      return {
        boss: updatedBoss,
        raidLog,
        phaseChanged,
        newPhase,
        defeated,
        damage,
        isCrit
      };
    });

    const { boss, raidLog, phaseChanged, newPhase, defeated } = updateResult;

    // Grant combat participant XP
    await xpService.grantXp({
      userId,
      source: 'BOSS_DAMAGE',
      sourceRef: `raid-hit-${raidLog.id}`,
      amount: Math.round(damage / 10),
      label: `Dealt ${damage} damage to ${boss.name}`
    });

    // 3. Emit Real-time Socket Events
    emitToBoss(boss.id, 'boss:hit', {
      currentHp: boss.currentHp,
      maxHp: boss.maxHp,
      damage,
      isCrit,
      phaseNumber: boss.currentPhase,
      logEntry: {
        id: raidLog.id,
        userName: user.name,
        action: abilityName,
        damage,
        isCrit,
        timestamp: raidLog.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    });

    if (phaseChanged) {
      emitToBoss(boss.id, 'boss:phase', {
        newPhase,
        phaseName: `Phase ${newPhase} — Transaction Deadlock`
      });
      emitToGuild(boss.guildId, 'guild:activity', {
        id: `act-${Date.now()}`,
        userName: user.name,
        userAvatarSeed: user.avatarSeed,
        userAvatarColor: user.avatarColor,
        actionText: 'shattered boss threshold into',
        target: `Phase ${newPhase}`,
        timestamp: 'Just now',
        type: 'boss'
      });
    }

    if (defeated) {
      emitToBoss(boss.id, 'boss:defeated', {
        bossName: boss.name,
        rewardXp: 1000
      });
      emitToGuild(boss.guildId, 'guild:activity', {
        id: `act-${Date.now()}`,
        userName: user.name,
        userAvatarSeed: user.avatarSeed,
        userAvatarColor: user.avatarColor,
        actionText: 'landed the final blow on',
        target: boss.name,
        timestamp: 'Just now',
        type: 'boss'
      });
    }

    return {
      damage,
      isCrit,
      currentHp: boss.currentHp,
      maxHp: boss.maxHp,
      defeated,
      log: raidLog
    };
  }

  async getRaidLogs(limit = 20) {
    const logs = await prisma.bossRaidLog.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return logs.map((l) => ({
      id: l.id,
      userName: l.user.name,
      action: l.action,
      damage: l.damage,
      isCrit: l.isCrit,
      phaseNumber: l.phaseAtHit,
      timestamp: l.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: l.message
    }));
  }
}

export const bossService = new BossService();
