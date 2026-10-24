import {
  Guild,
  GuildMember,
  UserProfile,
  BossEncounter,
  Quest,
  ActivityItem,
  StudyRoom,
  Achievement
} from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Ishant',
  roleClass: 'Rune Architect',
  level: 12,
  currentXp: 420,
  maxXp: 800,
  dailyStreak: 5,
  questsCompletedThisWeek: 8,
  masteryScore: 68,
  avatarSeed: 'ishant',
  avatarColor: '#06b6d4'
};

export const INITIAL_GUILDS: Guild[] = [
  {
    id: 'shadow-protocol',
    name: 'Shadow Protocol',
    tag: 'SP',
    level: 4,
    currentXp: 2480,
    maxXp: 6000,
    memberCount: 8,
    maxMembers: 12,
    onlineCount: 5,
    description: 'Six weeks to master SQL. Four adventurers. One legendary challenge.',
    emblemColor: '#06b6d4',
    emblemIcon: 'shield'
  },
  {
    id: 'midnight-scholars',
    name: 'The Midnight Scholars',
    tag: 'TMS',
    level: 3,
    currentXp: 1840,
    maxXp: 4500,
    memberCount: 5,
    maxMembers: 8,
    onlineCount: 3,
    description: 'Late night algorithms, distributed systems, and competitive problem solving.',
    emblemColor: '#8b5cf6',
    emblemIcon: 'book-open'
  },
  {
    id: 'code-shinobi',
    name: 'Code Shinobi',
    tag: 'CS',
    level: 5,
    currentXp: 4120,
    maxXp: 7500,
    memberCount: 6,
    maxMembers: 10,
    onlineCount: 4,
    description: 'Fast, stealthy execution. Full-stack TypeScript and low-level Rust mastery.',
    emblemColor: '#10b981',
    emblemIcon: 'zap'
  },
  {
    id: 'arcane-academy',
    name: 'Arcane Academy',
    tag: 'AA',
    level: 2,
    currentXp: 950,
    maxXp: 3000,
    memberCount: 4,
    maxMembers: 8,
    onlineCount: 2,
    description: 'Foundational computer science principles, discrete math, and graph theory.',
    emblemColor: '#3b82f6',
    emblemIcon: 'compass'
  }
];

export const INITIAL_BOSS: BossEncounter = {
  name: 'THE QUERY DEVOURER',
  subtitle: 'An ancient corrupted index entity consuming database clusters across the realm.',
  difficulty: 'LEGENDARY',
  overallProgress: 68,
  element: 'Void / Latency',
  lore: 'Spawned from an unindexed trillion-row JOIN disaster in the subterranean server vaults. Only perfectly optimized relational spells can shatter its core.',
  currentPhase: {
    number: 2,
    name: 'Phase 2 — The Join Labyrinth',
    status: 'active',
    bossHp: 6400,
    bossMaxHp: 20000
  },
  phases: [
    {
      number: 1,
      name: 'Phase 1 — Unindexed Depths',
      status: 'completed',
      bossHp: 0,
      bossMaxHp: 10000
    },
    {
      number: 2,
      name: 'Phase 2 — The Join Labyrinth',
      status: 'active',
      bossHp: 6400,
      bossMaxHp: 20000
    },
    {
      number: 3,
      name: 'Phase 3 — Transaction Deadlock',
      status: 'locked',
      bossHp: 30000,
      bossMaxHp: 30000
    }
  ]
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-1',
    difficulty: 'COMMON',
    title: 'The SELECT Awakening',
    description: 'Learn the power of SELECT and retrieve the lost data.',
    rewardXp: 120,
    duration: '20 min',
    progress: 3,
    maxProgress: 4,
    completed: false,
    category: 'SQL Fundamentals',
    objective: 'Extract high-priority inventory logs from the corrupted archive table using projection & filters.',
    steps: [
      { id: 1, text: 'Inspect schema columns in system catalog', completed: true },
      { id: 2, text: 'Filter records using WHERE status = "ACTIVE"', completed: true },
      { id: 3, text: 'Order results by created_at DESC with LIMIT 50', completed: true },
      { id: 4, text: 'Execute query with execution plan verification', completed: false }
    ]
  },
  {
    id: 'quest-2',
    difficulty: 'RARE',
    title: 'Trial of the JOINs',
    description: 'Master different JOIN types and unlock the hidden tables.',
    rewardXp: 220,
    duration: '35 min',
    progress: 0,
    maxProgress: 4,
    completed: false,
    category: 'Relational Operations',
    objective: 'Reconstruct fragmented adventurer records across guilds, credentials, and spell slots using INNER & LEFT OUTER JOINs.',
    steps: [
      { id: 1, text: 'Identify foreign key constraints on guild_members', completed: false },
      { id: 2, text: 'Craft an INNER JOIN between users and party_rosters', completed: false },
      { id: 3, text: 'Handle orphan records with LEFT JOIN and COALESCE', completed: false },
      { id: 4, text: 'Resolve cartesian explosion with proper ON predicates', completed: false }
    ]
  },
  {
    id: 'quest-3',
    difficulty: 'EPIC',
    title: 'Decode the Ancient Schema',
    description: 'Uncover the secrets of the forgotten database.',
    rewardXp: 180,
    duration: '30 min',
    progress: 1,
    maxProgress: 3,
    completed: false,
    category: 'Advanced Schema Architecture',
    objective: 'Reverse-engineer 3NF normalized tables from denormalized runic monolith records.',
    steps: [
      { id: 1, text: 'Decompose repetitive columns into atomic entities', completed: true },
      { id: 2, text: 'Establish transitive dependency isolation', completed: false },
      { id: 3, text: 'Generate DDL migration with composite primary keys', completed: false }
    ]
  },
  {
    id: 'quest-4',
    difficulty: 'EPIC',
    title: 'Window Function Sorcery',
    description: 'Harness PARTITION BY and OVER clauses to calculate rolling guild rankings.',
    rewardXp: 280,
    duration: '45 min',
    progress: 2,
    maxProgress: 5,
    completed: false,
    category: 'Analytical SQL',
    objective: 'Compute running XP totals and rank guild members without self-joining.',
    steps: [
      { id: 1, text: 'Apply ROW_NUMBER() over party partitions', completed: true },
      { id: 2, text: 'Calculate DENSE_RANK() by weekly XP contribution', completed: true },
      { id: 3, text: 'Compute 7-day rolling average study hours', completed: false },
      { id: 4, text: 'Detect streak discontinuities with LAG() and LEAD()', completed: false },
      { id: 5, text: 'Benchmark window execution against subqueries', completed: false }
    ]
  }
];

export const INITIAL_MEMBERS: GuildMember[] = [
  {
    id: 'm1',
    name: 'Ishant',
    roleClass: 'Rune Architect',
    level: 12,
    status: 'In a quest',
    isOnline: true,
    avatarSeed: 'ishant',
    avatarColor: '#06b6d4',
    currentXp: 420,
    maxXp: 800
  },
  {
    id: 'm2',
    name: 'Akira',
    roleClass: 'Shadow Scholar',
    level: 14,
    status: 'In Study Room',
    isOnline: true,
    avatarSeed: 'akira',
    avatarColor: '#38bdf8',
    currentXp: 690,
    maxXp: 950
  },
  {
    id: 'm3',
    name: 'Mika',
    roleClass: 'Arcane Healer',
    level: 13,
    status: 'In Guild Hall',
    isOnline: true,
    avatarSeed: 'mika',
    avatarColor: '#a855f7',
    currentXp: 510,
    maxXp: 850
  },
  {
    id: 'm4',
    name: 'Ren',
    roleClass: 'Blade of Logic',
    level: 13,
    status: 'In Boss Arena',
    isOnline: true,
    avatarSeed: 'ren',
    avatarColor: '#ef4444',
    currentXp: 610,
    maxXp: 850
  },
  {
    id: 'm5',
    name: 'Kai',
    roleClass: 'Starbound Coder',
    level: 12,
    status: 'In Study Room',
    isOnline: true,
    avatarSeed: 'kai',
    avatarColor: '#10b981',
    currentXp: 380,
    maxXp: 800
  },
  {
    id: 'm6',
    name: 'Sora',
    roleClass: 'Windcaller',
    level: 11,
    status: 'Online',
    isOnline: true,
    avatarSeed: 'sora',
    avatarColor: '#f59e0b',
    currentXp: 720,
    maxXp: 750
  },
  {
    id: 'm7',
    name: 'Yuki',
    roleClass: 'Chrono Mage',
    level: 10,
    status: 'Offline',
    isOnline: false,
    avatarSeed: 'yuki',
    avatarColor: '#64748b',
    currentXp: 210,
    maxXp: 700
  },
  {
    id: 'm8',
    name: 'Kael',
    roleClass: 'Cipher Knight',
    level: 9,
    status: 'Offline',
    isOnline: false,
    avatarSeed: 'kael',
    avatarColor: '#475569',
    currentXp: 180,
    maxXp: 650
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    userName: 'Akira',
    userAvatarSeed: 'akira',
    userAvatarColor: '#38bdf8',
    actionText: 'completed',
    target: 'The SELECT Awakening',
    timestamp: '2m ago',
    type: 'quest'
  },
  {
    id: 'act-2',
    userName: 'Ren',
    userAvatarSeed: 'ren',
    userAvatarColor: '#ef4444',
    actionText: 'leveled up to',
    target: 'Lv. 13',
    timestamp: '12m ago',
    type: 'level'
  },
  {
    id: 'act-3',
    userName: 'Shadow Protocol',
    userAvatarSeed: 'sp',
    userAvatarColor: '#06b6d4',
    actionText: 'unlocked the',
    target: 'Quest Master achievement',
    timestamp: '1h ago',
    type: 'achievement'
  },
  {
    id: 'act-4',
    userName: 'Ishant',
    userAvatarSeed: 'ishant',
    userAvatarColor: '#06b6d4',
    actionText: 'joined',
    target: 'Study Sanctuary',
    timestamp: '2h ago',
    type: 'study'
  },
  {
    id: 'act-5',
    userName: 'Astra',
    userAvatarSeed: 'astra',
    userAvatarColor: '#06b6d4',
    actionText: 'defeated Phase 1 of',
    target: 'The Query Devourer',
    timestamp: '3h ago',
    type: 'boss'
  }
];

export const INITIAL_STUDY_ROOM: StudyRoom = {
  id: 'study-sanctuary',
  name: 'Study Sanctuary',
  onlineCount: 3,
  maxCapacity: 6,
  topic: 'SQL Joins',
  initialTimeSeconds: 18 * 60 + 42, // 00:18:42
  activeMembers: [
    { name: 'Akira', avatarSeed: 'akira', avatarColor: '#38bdf8' },
    { name: 'Kai', avatarSeed: 'kai', avatarColor: '#10b981' },
    { name: 'Ishant', avatarSeed: 'ishant', avatarColor: '#06b6d4' },
    { name: 'Mika', avatarSeed: 'mika', avatarColor: '#a855f7' }
  ],
  isLive: true
};

export const MENTOR_ASTRA = {
  name: 'Astra',
  title: 'Guild Master NPC',
  role: 'Guild Master',
  message: '“Your party is getting stronger. One more trial stands between you and the next boss phase.”',
  hints: [
    "Remember: An INNER JOIN discards unmatched rows from both sides, while a LEFT JOIN preserves every row from the primary table.",
    "When tackling Phase 2 of The Query Devourer, watch out for unindexed foreign keys — they multiply latency damage by 10x!",
    "Using EXPLAIN ANALYZE on your queries lets you spot expensive sequential scans before the Boss activates its Void Barrier.",
    "Study sessions in the Sanctuary grant a +15% Party XP aura when at least 3 guildmates are focused together."
  ],
  challenges: [
    {
      title: 'Quick Trial: The Phantom Join',
      question: 'Which join type would you use to retain all users even if they have not completed any quests?',
      options: ['INNER JOIN', 'LEFT OUTER JOIN', 'CROSS JOIN', 'RIGHT INNER JOIN'],
      correctIndex: 1,
      explanation: 'A LEFT JOIN keeps all rows from the left (users) table, filling missing quest columns with NULL.'
    },
    {
      title: 'Quick Trial: Index Mastery',
      question: 'What happens to write performance (INSERT/UPDATE) when too many composite indexes are created?',
      options: ['Write speed improves linearly', 'Writes slow down as each index must update', 'No measurable impact', 'Transactions automatically abort'],
      correctIndex: 1,
      explanation: 'Every index must be updated on write operations, trading query speed for insert overhead.'
    }
  ]
};

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Quest Master',
    description: 'Complete 25 guild quests across any curriculum chapter.',
    tier: 'Gold',
    category: 'Quest',
    icon: 'compass',
    progress: 25,
    maxProgress: 25,
    unlocked: true,
    unlockedAt: '1 hour ago',
    xpReward: 500
  },
  {
    id: 'ach-2',
    title: 'First Blood: Query Devourer',
    description: 'Deliver the final strike to Phase 1 of The Query Devourer.',
    tier: 'Silver',
    category: 'Boss',
    icon: 'swords',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: '3 hours ago',
    xpReward: 350
  },
  {
    id: 'ach-3',
    title: 'Sanctuary Monk',
    description: 'Log 10 hours in the live collaborative Study Sanctuary.',
    tier: 'Silver',
    category: 'Study',
    icon: 'headphones',
    progress: 6,
    maxProgress: 10,
    unlocked: false,
    xpReward: 300
  },
  {
    id: 'ach-4',
    title: 'Relational Architect',
    description: 'Design 5 database schemas with zero 3NF normal form violations.',
    tier: 'Mythic',
    category: 'Quest',
    icon: 'database',
    progress: 3,
    maxProgress: 5,
    unlocked: false,
    xpReward: 750
  },
  {
    id: 'ach-5',
    title: 'Iron Focus Streak',
    description: 'Maintain a study streak of 7 consecutive days.',
    tier: 'Bronze',
    category: 'Study',
    icon: 'flame',
    progress: 5,
    maxProgress: 7,
    unlocked: false,
    xpReward: 200
  },
  {
    id: 'ach-6',
    title: 'Fellowship of the Query',
    description: 'Invite and study alongside 5 unique party members.',
    tier: 'Bronze',
    category: 'Social',
    icon: 'users',
    progress: 4,
    maxProgress: 5,
    unlocked: false,
    xpReward: 150
  }
];
