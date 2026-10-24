import { prisma } from '../../lib/prisma.js';
import { redis } from '../../lib/redis.js';
import { XpSource } from '@prisma/client';
import { emitToUser, emitToGuild } from '../../realtime/emitters.js';
import { logger } from '../../lib/logger.js';

export function calculateMaxXp(level: number): number {
  return 500 + 250 * (level - 1);
}

export function getCurrentIsoWeek(): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
}

export class XpService {
  async grantXp(params: {
    userId: string;
    source: XpSource;
    sourceRef: string;
    amount: number;
    label?: string;
    guildId?: string;
  }) {
    const { userId, source, sourceRef, amount, label } = params;

    if (amount <= 0) return null;

    // 1. Transactional Idempotency Check & Mutation
    const result = await prisma.$transaction(async (tx) => {
      // Idempotency: verify this exact XP event was not granted before
      const existing = await tx.xpEvent.findUnique({
        where: {
          userId_source_sourceRef: {
            userId,
            source,
            sourceRef
          }
        }
      });

      if (existing) {
        logger.info({ userId, source, sourceRef }, 'XP already granted, returning existing event');
        return { isNew: false, event: existing, user: null, levelUps: [] };
      }

      // Determine guild if not passed
      let guildId = params.guildId;
      if (!guildId) {
        const membership = await tx.guildMember.findFirst({
          where: { userId }
        });
        guildId = membership?.guildId;
      }

      // Record XP event
      const event = await tx.xpEvent.create({
        data: {
          userId,
          guildId,
          source,
          sourceRef,
          amount
        }
      });

      // Update User
      const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      let currentXp = user.currentXp + amount;
      let totalXp = user.totalXp + amount;
      let level = user.level;
      let maxXp = user.maxXp || calculateMaxXp(level);
      const levelUps: number[] = [];

      // Level-up loop (overflow carries over)
      while (currentXp >= maxXp) {
        currentXp -= maxXp;
        level += 1;
        maxXp = calculateMaxXp(level);
        levelUps.push(level);
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          level,
          currentXp,
          maxXp,
          totalXp,
          lastActiveDate: new Date().toISOString().split('T')[0]
        }
      });

      // Update Guild XP if user is in a guild
      let updatedGuild = null;
      if (guildId) {
        const guild = await tx.guild.findUnique({ where: { id: guildId } });
        if (guild) {
          let gCurrentXp = guild.currentXp + amount;
          let gLevel = guild.level;
          let gMaxXp = guild.maxXp;

          while (gCurrentXp >= gMaxXp) {
            gCurrentXp -= gMaxXp;
            gLevel += 1;
            gMaxXp = 3000 + (gLevel - 1) * 1500;
          }

          updatedGuild = await tx.guild.update({
            where: { id: guildId },
            data: {
              currentXp: gCurrentXp,
              level: gLevel,
              maxXp: gMaxXp
            }
          });
        }
      }

      return {
        isNew: true,
        event,
        user: updatedUser,
        guild: updatedGuild,
        levelUps,
        guildId
      };
    });

    if (!result.isNew || !result.user) {
      return result.event;
    }

    const { user, guild, levelUps, guildId } = result;

    // 2. Bump Redis Leaderboard (Outside transaction)
    if (guildId) {
      const isoWeek = getCurrentIsoWeek();
      try {
        await redis.zincrby(`lb:xp:${guildId}:${isoWeek}`, amount, userId);
      } catch (err: any) {
        logger.warn({ err: err.message }, 'Failed to bump Redis leaderboard');
      }
    }

    // 3. Emit Real-Time Events
    emitToUser(userId, 'xp:gained', {
      amount,
      source,
      label: label || `+${amount} XP Gained`,
      newXp: user.currentXp,
      currentXp: user.currentXp,
      maxXp: user.maxXp
    });

    emitToUser(userId, 'user:stats', {
      level: user.level,
      currentXp: user.currentXp,
      maxXp: user.maxXp,
      totalXp: user.totalXp,
      dailyStreak: user.dailyStreak,
      masteryScore: user.masteryScore
    });

    for (const newLvl of levelUps) {
      emitToUser(userId, 'level:up', {
        userId,
        userName: user.name,
        newLevel: newLvl
      });

      if (guildId) {
        emitToGuild(guildId, 'guild:activity', {
          id: `act-${Date.now()}-${Math.random()}`,
          userName: user.name,
          userAvatarSeed: user.avatarSeed,
          userAvatarColor: user.avatarColor,
          actionText: 'ascended to Level',
          target: `${newLvl}`,
          timestamp: 'Just now',
          type: 'level'
        });
      }
    }

    if (guild && guildId) {
      emitToGuild(guildId, 'guild:stats', {
        level: guild.level,
        currentXp: guild.currentXp,
        maxXp: guild.maxXp
      });
    }

    return result.event;
  }
}

export const xpService = new XpService();
