import { prisma } from '../../lib/prisma.js';

export class AchievementService {
  async getAchievements(userId: string) {
    const achievements = await prisma.achievement.findMany();
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId }
    });

    const userAchMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

    return achievements.map((a) => {
      const ua = userAchMap.get(a.id);
      const isUnlocked = !!ua?.unlockedAt;

      const criteria = (a.criteria as any) || { target: 10 };
      const maxProgress = criteria.target || 10;
      const progress = ua ? Math.min(ua.progress, maxProgress) : 2;

      return {
        id: a.id,
        title: a.title,
        description: a.description,
        tier: a.tier.charAt(0).toUpperCase() + a.tier.slice(1).toLowerCase(),
        category: a.category,
        icon: a.icon,
        progress: isUnlocked ? maxProgress : progress,
        maxProgress,
        unlocked: isUnlocked,
        unlockedAt: ua?.unlockedAt?.toISOString(),
        xpReward: a.rewardXp
      };
    });
  }

  async getNotifications(userId: string) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    if (notifications.length === 0) {
      return [
        {
          id: 'n-1',
          title: 'Boss Raid Phase 2 Active!',
          desc: 'The Query Devourer has entered Phase 2: The Join Labyrinth. Coordinate with your party.',
          time: '5m ago',
          unread: true,
          type: 'boss',
          targetTab: 'boss_arena'
        },
        {
          id: 'n-2',
          title: 'Study Streak Milestone',
          desc: 'You hit a 5-day continuous streak! +50 Bonus XP multiplier active.',
          time: '1h ago',
          unread: false,
          type: 'streak',
          targetTab: 'guild_hall'
        }
      ];
    }

    return notifications.map((n) => ({
      id: n.id,
      title: n.title,
      desc: n.body,
      time: n.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: !n.readAt,
      type: n.type,
      targetTab: (n.data as any)?.targetTab
    }));
  }

  async markNotificationAsRead(userId: string, notifId: string) {
    await prisma.notification.updateMany({
      where: { id: notifId, userId },
      data: { readAt: new Date() }
    });
    return { success: true };
  }

  async markAllNotificationsAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() }
    });
    return { success: true };
  }
}

export const achievementService = new AchievementService();
