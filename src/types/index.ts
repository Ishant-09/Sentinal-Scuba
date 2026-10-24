export type NavigationItem = 
  | 'guild_hall'
  | 'quests'
  | 'boss_arena'
  | 'study_rooms'
  | 'achievements'
  | 'friends'
  | 'settings'
  | '404';

export type QuestDifficulty = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Quest {
  id: string;
  difficulty: QuestDifficulty;
  title: string;
  description: string;
  rewardXp: number;
  duration: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  category: string;
  objective: string;
  steps: {
    id: number;
    text: string;
    completed: boolean;
  }[];
}

export interface GuildMember {
  id: string;
  name: string;
  roleClass: string;
  level: number;
  status: 'In a quest' | 'In Study Room' | 'In Guild Hall' | 'In Boss Arena' | 'Online' | 'Offline';
  isOnline: boolean;
  avatarSeed: string;
  avatarColor: string;
  currentXp: number;
  maxXp: number;
}

export interface Guild {
  id: string;
  name: string;
  tag: string;
  level: number;
  currentXp: number;
  maxXp: number;
  memberCount: number;
  maxMembers: number;
  onlineCount: number;
  description: string;
  emblemColor: string;
  emblemIcon: string;
}

export interface ActivityItem {
  id: string;
  userName: string;
  userAvatarSeed: string;
  userAvatarColor: string;
  actionText: string;
  target: string;
  timestamp: string;
  type: 'quest' | 'level' | 'achievement' | 'study' | 'boss';
}

export interface BossPhase {
  number: number;
  name: string;
  status: 'completed' | 'active' | 'locked';
  bossHp: number;
  bossMaxHp: number;
}

export interface BossEncounter {
  name: string;
  subtitle: string;
  difficulty: string;
  currentPhase: BossPhase;
  phases: BossPhase[];
  overallProgress: number;
  element: string;
  lore: string;
}

export interface UserProfile {
  name: string;
  roleClass: string;
  level: number;
  currentXp: number;
  maxXp: number;
  dailyStreak: number;
  questsCompletedThisWeek: number;
  masteryScore: number;
  avatarSeed: string;
  avatarColor: string;
}

export interface StudyRoom {
  id: string;
  name: string;
  onlineCount: number;
  maxCapacity: number;
  topic: string;
  initialTimeSeconds: number;
  activeMembers: {
    name: string;
    avatarSeed: string;
    avatarColor: string;
  }[];
  isLive: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Mythic';
  category: 'Quest' | 'Study' | 'Boss' | 'Social';
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface DayProgress {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  xp: number;
  targetXp: number;
  completed: boolean;
  isToday: boolean;
}

export interface WeeklyProgressData {
  currentWeekXp: number;
  weeklyGoalXp: number;
  days: DayProgress[];
  multiplier: string;
}
