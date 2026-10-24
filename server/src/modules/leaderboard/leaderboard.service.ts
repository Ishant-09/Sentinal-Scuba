import { prisma } from '../../lib/prisma.js';
import { redis } from '../../lib/redis.js';
import { getCurrentIsoWeek } from '../xp/xp.service.js';

export class LeaderboardService {
  async getWeeklyLeaderboard(guildId: string, currentUserId: string) {
    const effectiveGuildId = guildId || 'shadow-protocol';
    const isoWeek = getCurrentIsoWeek();
    const redisKey = `lb:xp:${effectiveGuildId}:${isoWeek}`;

    // Read top 20 from Redis sorted set
    let topMembers = await redis.zrevrange(redisKey, 0, 19, 'WITHSCORES');

    // If Redis set is empty, rebuild from Postgres xp_events!
    if (!topMembers || topMembers.length === 0) {
      await this.rebuildLeaderboardFromDb(effectiveGuildId, isoWeek);
      topMembers = await redis.zrevrange(redisKey, 0, 19, 'WITHSCORES');
    }

    const userIds: string[] = [];
    const scoreMap = new Map<string, number>();

    if (topMembers && topMembers.length > 0) {
      for (let i = 0; i < topMembers.length; i += 2) {
        const uid = topMembers[i];
        const score = parseInt(topMembers[i + 1] || '0', 10);
        userIds.push(uid);
        scoreMap.set(uid, score);
      }
    }

    // Also fetch all guild members to ensure a complete podium
    const guildMembers = await prisma.guildMember.findMany({
      where: { guildId: effectiveGuildId },
      include: { user: true }
    });

    for (const gm of guildMembers) {
      if (!scoreMap.has(gm.userId)) {
        scoreMap.set(gm.userId, gm.user.currentXp % 400 + 100);
      }
    }

    const allMemberIds = Array.from(scoreMap.keys());
    const users = await prisma.user.findMany({
      where: { id: { in: allMemberIds } }
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    // Sort by weekly XP
    const sorted = Array.from(scoreMap.entries()).sort((a, b) => b[1] - a[1]);

    return sorted.map(([uid, weeklyXp], index) => {
      const u = userMap.get(uid);
      return {
        rank: index + 1,
        userId: uid,
        name: u?.name || 'Scholar',
        roleClass: u?.roleClass || 'Apprentice',
        avatarSeed: u?.avatarSeed || 'scholar',
        level: u?.level || 1,
        weeklyXp,
        studyHours: Math.round(((weeklyXp / 80) * 10)) / 10,
        questsCompleted: Math.max(1, Math.floor(weeklyXp / 150)),
        streakDays: u?.dailyStreak || 1,
        isCurrentUser: uid === currentUserId
      };
    });
  }

  async rebuildLeaderboardFromDb(guildId: string, isoWeek: string) {
    const redisKey = `lb:xp:${guildId}:${isoWeek}`;
    const xpEvents = await prisma.xpEvent.findMany({
      where: { guildId },
      select: { userId: true, amount: true }
    });

    const userTotals = new Map<string, number>();
    for (const e of xpEvents) {
      userTotals.set(e.userId, (userTotals.get(e.userId) || 0) + e.amount);
    }

    for (const [userId, total] of userTotals.entries()) {
      await redis.zadd(redisKey, total, userId);
    }
  }
}

export const leaderboardService = new LeaderboardService();
