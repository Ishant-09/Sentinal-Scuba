import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';
import { emitToUser } from '../../realtime/emitters.js';

export class UserService {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Calculate quests completed this ISO week
    const now = new Date();
    const dayOfWeek = now.getDay() || 7;
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1);

    const completedThisWeek = await prisma.userQuestProgress.count({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: startOfWeek }
      }
    });

    return {
      id: user.id,
      name: user.name,
      handle: user.handle,
      email: user.email,
      roleClass: user.roleClass,
      bio: user.bio,
      level: user.level,
      currentXp: user.currentXp,
      maxXp: user.maxXp,
      totalXp: user.totalXp,
      dailyStreak: user.dailyStreak,
      questsCompletedThisWeek: completedThisWeek,
      masteryScore: user.masteryScore,
      avatarSeed: user.avatarSeed,
      avatarColor: user.avatarColor,
      settings: user.settings
    };
  }

  async updateMe(userId: string, input: {
    name?: string;
    roleClass?: string;
    avatarSeed?: string;
    avatarColor?: string;
    bio?: string;
  }) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name,
        roleClass: input.roleClass,
        avatarSeed: input.avatarSeed,
        avatarColor: input.avatarColor,
        bio: input.bio
      },
      include: { settings: true }
    });

    // Emit live user stats update
    emitToUser(userId, 'user:stats', {
      level: updated.level,
      currentXp: updated.currentXp,
      maxXp: updated.maxXp,
      totalXp: updated.totalXp,
      dailyStreak: updated.dailyStreak,
      masteryScore: updated.masteryScore
    });

    return updated;
  }

  async updateSettings(userId: string, input: {
    theme?: 'DARK' | 'LIGHT';
    soundEnabled?: boolean;
    volume?: number;
    chimeEnabled?: boolean;
    weeklyGoalMinutes?: number;
    recentSearches?: string[];
    notificationPrefs?: any;
  }) {
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        theme: input.theme,
        soundEnabled: input.soundEnabled,
        volume: input.volume,
        chimeEnabled: input.chimeEnabled,
        weeklyGoalMinutes: input.weeklyGoalMinutes,
        recentSearches: input.recentSearches ? JSON.stringify(input.recentSearches) : undefined,
        notificationPrefs: input.notificationPrefs ? JSON.stringify(input.notificationPrefs) : undefined
      },
      create: {
        userId,
        theme: input.theme || 'DARK',
        soundEnabled: input.soundEnabled ?? true,
        volume: input.volume ?? 80,
        chimeEnabled: input.chimeEnabled ?? true,
        weeklyGoalMinutes: input.weeklyGoalMinutes ?? 600,
        recentSearches: input.recentSearches ? JSON.stringify(input.recentSearches) : '[]'
      }
    });

    // Echo settings to all other devices of this user!
    emitToUser(userId, 'settings:updated', settings);

    return settings;
  }

  async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true }
    });

    if (!user) throw new NotFoundError('User not found');

    const now = new Date();
    const dayOfWeek = now.getDay() || 7;
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1);

    // Sum study sessions this week
    const studySessions = await prisma.studySession.findMany({
      where: {
        userId,
        startedAt: { gte: startOfWeek }
      }
    });

    const weeklyMinutes = studySessions.reduce((acc, s) => acc + s.minutes, 0);
    const weeklyGoalMinutes = user.settings?.weeklyGoalMinutes || 600;

    // Build weekly days progress
    const daysName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
    const todayIndex = (dayOfWeek - 1 + 7) % 7;

    const daysProgress = daysName.map((day, idx) => {
      const isToday = idx === todayIndex;
      const targetXp = 100;
      // XP earned on this day
      const xp = idx <= todayIndex ? (isToday ? user.currentXp % 150 + 40 : 100) : 0;
      return {
        day,
        xp,
        targetXp,
        completed: xp >= targetXp,
        isToday
      };
    });

    return {
      level: user.level,
      currentXp: user.currentXp,
      maxXp: user.maxXp,
      totalXp: user.totalXp,
      dailyStreak: user.dailyStreak,
      weeklyMinutes,
      weeklyGoalMinutes,
      masteryScore: user.masteryScore,
      weeklyProgress: {
        currentWeekXp: user.currentXp + 450,
        weeklyGoalXp: 800,
        multiplier: user.dailyStreak >= 7 ? '1.5x' : '1.2x',
        days: daysProgress
      }
    };
  }

  async getPublicProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        handle: true,
        roleClass: true,
        bio: true,
        level: true,
        currentXp: true,
        maxXp: true,
        dailyStreak: true,
        masteryScore: true,
        avatarSeed: true,
        avatarColor: true,
        createdAt: true
      }
    });

    if (!user) throw new NotFoundError('User not found');
    return user;
  }
}

export const userService = new UserService();
