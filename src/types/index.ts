export type NavigationItem = 
  | 'guild_hall'
  | 'quests'
  | 'leaderboard'
  | 'boss_arena'
  | 'study_rooms'
  | 'study_chat'
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
  id?: string;
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
  handle?: string;
  email?: string;
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
  tag?: string;
  description?: string;
  isScreenSharing?: boolean;
}

export type StudyRoomTab = 'focus' | 'screenshare' | 'whiteboard' | 'games' | 'notes';

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'boss' | 'study' | 'streak' | 'quest' | 'achievement' | 'party';
  targetTab?: NavigationItem;
  roomId?: string;
  roomName?: string;
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

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  roleClass: string;
  avatarSeed: string;
  level: number;
  weeklyXp: number;
  studyHours: number;
  questsCompleted: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

export interface ChatReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  timestamp: string;
  text: string;
  codeSnippet?: string;
  reactions: ChatReaction[];
  deviceId?: string;
}
