import {
  Guild,
  GuildMember,
  UserProfile,
  BossEncounter,
  Quest,
  ActivityItem,
  StudyRoom,
  Achievement,
  AppNotification
} from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Ishant Phadatare',
  roleClass: 'Rune Architect',
  level: 1,
  currentXp: 0,
  maxXp: 500,
  dailyStreak: 0,
  questsCompletedThisWeek: 0,
  masteryScore: 0,
  avatarSeed: 'ishant',
  avatarColor: '#06b6d4'
};

export const INITIAL_GUILDS: Guild[] = [
  {
    id: 'shadow-protocol',
    name: 'Shadow Protocol',
    tag: 'SP',
    level: 1,
    currentXp: 0,
    maxXp: 3000,
    memberCount: 4,
    maxMembers: 12,
    onlineCount: 4,
    description: 'Six weeks to master SQL. Four adventurers. One legendary challenge.',
    emblemColor: '#06b6d4',
    emblemIcon: 'shield'
  },
  {
    id: 'midnight-scholars',
    name: 'The Midnight Scholars',
    tag: 'TMS',
    level: 1,
    currentXp: 0,
    maxXp: 3000,
    memberCount: 4,
    maxMembers: 8,
    onlineCount: 2,
    description: 'Late night algorithms, distributed systems, and competitive problem solving.',
    emblemColor: '#8b5cf6',
    emblemIcon: 'book-open'
  },
  {
    id: 'code-shinobi',
    name: 'Code Shinobi',
    tag: 'CS',
    level: 1,
    currentXp: 0,
    maxXp: 3000,
    memberCount: 4,
    maxMembers: 10,
    onlineCount: 2,
    description: 'Fast, stealthy execution. Full-stack TypeScript and low-level Rust mastery.',
    emblemColor: '#10b981',
    emblemIcon: 'zap'
  },
  {
    id: 'arcane-academy',
    name: 'Arcane Academy',
    tag: 'AA',
    level: 1,
    currentXp: 0,
    maxXp: 3000,
    memberCount: 4,
    maxMembers: 8,
    onlineCount: 1,
    description: 'Foundational computer science principles, discrete math, and graph theory.',
    emblemColor: '#3b82f6',
    emblemIcon: 'compass'
  }
];

export const INITIAL_BOSS: BossEncounter = {
  name: 'THE QUERY DEVOURER',
  subtitle: 'An ancient corrupted index entity consuming database clusters across the realm.',
  difficulty: 'LEGENDARY',
  overallProgress: 0,
  element: 'Void / Latency',
  lore: 'Spawned from an unindexed trillion-row JOIN disaster in the subterranean server vaults. Only perfectly optimized relational spells can shatter its core.',
  currentPhase: {
    number: 1,
    name: 'Phase 1 — Unindexed Depths',
    status: 'active',
    bossHp: 10000,
    bossMaxHp: 10000
  },
  phases: [
    {
      number: 1,
      name: 'Phase 1 — Unindexed Depths',
      status: 'active',
      bossHp: 10000,
      bossMaxHp: 10000
    },
    {
      number: 2,
      name: 'Phase 2 — The Join Labyrinth',
      status: 'locked',
      bossHp: 20000,
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
    id: 'quest-python-1',
    difficulty: 'COMMON',
    title: 'Python Core & Scripting',
    description: 'Master variables, data structures, list comprehensions, and idiomatic Python control flow.',
    rewardXp: 120,
    duration: '25 min',
    progress: 0,
    maxProgress: 4,
    completed: false,
    category: 'Learning Python',
    objective: 'Write automated data parsing scripts using dictionaries, sets, and list comprehensions.',
    steps: [
      { id: 1, text: 'Configure virtual environment and poetry dependencies', completed: false },
      { id: 2, text: 'Transform raw datasets using list & dict comprehensions', completed: false },
      { id: 3, text: 'Implement robust error handling with custom exceptions', completed: false },
      { id: 4, text: 'Build generator functions to stream large memory blocks', completed: false }
    ]
  },
  {
    id: 'quest-python-2',
    difficulty: 'RARE',
    title: 'Object-Oriented Python Architecture',
    description: 'Design modular classes, dunder methods, polymorphism, and dependency injection patterns.',
    rewardXp: 220,
    duration: '35 min',
    progress: 0,
    maxProgress: 4,
    completed: false,
    category: 'Learning Python',
    objective: 'Implement an extensible domain model with encapsulation and custom iterators.',
    steps: [
      { id: 1, text: 'Define class schemas with @dataclass and type hints', completed: false },
      { id: 2, text: 'Override __repr__, __eq__, and __hash__ dunder methods', completed: false },
      { id: 3, text: 'Construct abstract base classes using the abc module', completed: false },
      { id: 4, text: 'Verify composition over inheritance with unit tests', completed: false }
    ]
  },
  {
    id: 'quest-prog-1',
    difficulty: 'RARE',
    title: 'Algorithmic Complexity & Big-O',
    description: 'Analyze time and space bounds across recursive divide-and-conquer and iterative algorithms.',
    rewardXp: 200,
    duration: '30 min',
    progress: 0,
    maxProgress: 4,
    completed: false,
    category: 'Computer Programming',
    objective: 'Derive asymptotic complexities and optimize quadratic O(N²) bottlenecks into linearithmic O(N log N).',
    steps: [
      { id: 1, text: 'Derive recurrence relations using Master Theorem', completed: false },
      { id: 2, text: 'Benchmark quicksort pivot variations against worst-case inputs', completed: false },
      { id: 3, text: 'Profile memory heap allocations and call-stack limits', completed: false },
      { id: 4, text: 'Document space-time trade-offs in technical design doc', completed: false }
    ]
  },
  {
    id: 'quest-prog-2',
    difficulty: 'EPIC',
    title: 'Design Patterns & Clean Code',
    description: 'Implement SOLID principles, Factory, and Observer patterns to refactor monolithic legacy code.',
    rewardXp: 250,
    duration: '40 min',
    progress: 0,
    maxProgress: 5,
    completed: false,
    category: 'Computer Programming',
    objective: 'Decouple tightly coupled modules into testable, inverted dependency interfaces.',
    steps: [
      { id: 1, text: 'Identify Single Responsibility violations in service classes', completed: false },
      { id: 2, text: 'Implement Factory Pattern for multi-platform connectors', completed: false },
      { id: 3, text: 'Establish event-driven Observer listeners for state changes', completed: false },
      { id: 4, text: 'Eliminate code smells through automated linter rules', completed: false },
      { id: 5, text: 'Achieve 90%+ code coverage on critical core paths', completed: false }
    ]
  },
  {
    id: 'quest-git-1',
    difficulty: 'COMMON',
    title: 'Git Branching & Merge Conflicts',
    description: 'Master rebase, cherry-pick, and three-way conflict resolutions without losing code history.',
    rewardXp: 140,
    duration: '20 min',
    progress: 0,
    maxProgress: 3,
    completed: false,
    category: 'Git & GitHub',
    objective: 'Navigate complex branch divergence, squash commits, and resolve conflicting index hunks.',
    steps: [
      { id: 1, text: 'Execute interactive rebase with git rebase -i HEAD~4', completed: false },
      { id: 2, text: 'Resolve semantic merge conflicts using diff3 conflict style', completed: false },
      { id: 3, text: 'Cherry-pick critical bug fixes onto staging release branches', completed: false }
    ]
  },
  {
    id: 'quest-git-2',
    difficulty: 'RARE',
    title: 'Open Source PRs & CI Workflows',
    description: 'Fork, branch, write conventional commits, and automate tests using GitHub Actions.',
    rewardXp: 190,
    duration: '30 min',
    progress: 0,
    maxProgress: 4,
    completed: false,
    category: 'Git & GitHub',
    objective: 'Submit production-grade pull requests with continuous integration matrix checks.',
    steps: [
      { id: 1, text: 'Fork upstream repository and configure remote tracking', completed: false },
      { id: 2, text: 'Formulate commits adhering to Conventional Commits standards', completed: false },
      { id: 3, text: 'Author GitHub Actions YAML pipeline for multi-OS testing', completed: false },
      { id: 4, text: 'Respond to code review feedback and push clean fixups', completed: false }
    ]
  },
  {
    id: 'quest-math-1',
    difficulty: 'EPIC',
    title: 'Discrete Mathematics & Proofs',
    description: 'Prove theorems using mathematical induction, graph theory invariants, and set relations.',
    rewardXp: 280,
    duration: '45 min',
    progress: 0,
    maxProgress: 3,
    completed: false,
    category: 'Mathematics',
    objective: 'Establish rigorous formal proofs for algorithmic correctness and graph bipartiteness.',
    steps: [
      { id: 1, text: 'Prove summation identities via weak and strong induction', completed: false },
      { id: 2, text: 'Compute Euler paths and Hamiltonian cycle conditions on graphs', completed: false },
      { id: 3, text: 'Formulate equivalence relations and partial order sets (posets)', completed: false }
    ]
  },
  {
    id: 'quest-math-2',
    difficulty: 'EPIC',
    title: 'Linear Algebra for Computing',
    description: 'Calculate vector projections, matrix transformations, eigenvalues, and dot product spaces.',
    rewardXp: 300,
    duration: '50 min',
    progress: 0,
    maxProgress: 4,
    completed: false,
    category: 'Mathematics',
    objective: 'Perform linear transformations and dimensional reduction algorithms using numpy matrices.',
    steps: [
      { id: 1, text: 'Compute vector dot and cross products in high-dimensional spaces', completed: false },
      { id: 2, text: 'Calculate determinants, matrix inverses, and Gaussian elimination', completed: false },
      { id: 3, text: 'Find eigenvalues and eigenvectors of transition matrices', completed: false },
      { id: 4, text: 'Implement Principal Component Analysis (PCA) projection', completed: false }
    ]
  }
];

export const QUEST_BANNERS = [
  {
    id: 'Learning Python',
    title: 'Learning Python',
    subtitle: 'From syntax fundamentals to clean OOP & async generators',
    tag: 'Core Track',
    accentColor: '#14b8a6',
    borderClass: 'border-teal-500/40 hover:border-teal-400',
    bgGradient: 'from-teal-950/40 via-[#0e1722] to-[#0a0f16]',
    icon: 'python',
    stats: '2 Active Quests • 340 XP'
  },
  {
    id: 'Computer Programming',
    title: 'Computer Programming',
    subtitle: 'Data structures, Big-O efficiency & SOLID design patterns',
    tag: 'Systems',
    accentColor: '#38bdf8',
    borderClass: 'border-sky-500/40 hover:border-sky-400',
    bgGradient: 'from-sky-950/40 via-[#0e1624] to-[#0a0f16]',
    icon: 'terminal',
    stats: '2 Active Quests • 450 XP'
  },
  {
    id: 'Git & GitHub',
    title: 'Git & GitHub',
    subtitle: 'Branching strategies, conflict resolution & CI/CD pipelines',
    tag: 'DevOps & Tools',
    accentColor: '#f59e0b',
    borderClass: 'border-amber-500/40 hover:border-amber-400',
    bgGradient: 'from-amber-950/40 via-[#18151f] to-[#0a0f16]',
    icon: 'git',
    stats: '2 Active Quests • 330 XP'
  },
  {
    id: 'Mathematics',
    title: 'Mathematics for CS',
    subtitle: 'Discrete proofs, induction, graph theory & linear algebra',
    tag: 'Foundations',
    accentColor: '#8b5cf6',
    borderClass: 'border-purple-500/40 hover:border-purple-400',
    bgGradient: 'from-purple-950/40 via-[#161226] to-[#0a0f16]',
    icon: 'math',
    stats: '2 Active Quests • 580 XP'
  }
];

export const INITIAL_LEADERBOARD = [
  {
    rank: 1,
    userId: 'm1',
    name: 'Ishant Phadatare',
    roleClass: 'Rune Architect',
    avatarSeed: 'ishant',
    level: 1,
    weeklyXp: 0,
    studyHours: 0,
    questsCompleted: 0,
    streakDays: 0,
    isCurrentUser: true
  },
  {
    rank: 2,
    userId: 'm2',
    name: 'Aviral Maurya',
    roleClass: 'Shadow Scholar',
    avatarSeed: 'aviral',
    level: 1,
    weeklyXp: 0,
    studyHours: 0,
    questsCompleted: 0,
    streakDays: 0,
    isCurrentUser: false
  },
  {
    rank: 3,
    userId: 'm4',
    name: 'Eknaath Bawane',
    roleClass: 'Blade of Logic',
    avatarSeed: 'eknaath',
    level: 1,
    weeklyXp: 0,
    studyHours: 0,
    questsCompleted: 0,
    streakDays: 0,
    isCurrentUser: false
  },
  {
    rank: 4,
    userId: 'm3',
    name: 'Ajay Gurjar',
    roleClass: 'Arcane Healer',
    avatarSeed: 'ajay',
    level: 1,
    weeklyXp: 0,
    studyHours: 0,
    questsCompleted: 0,
    streakDays: 0,
    isCurrentUser: false
  }
];

export const INITIAL_MEMBERS: GuildMember[] = [
  {
    id: 'm1',
    name: 'Ishant Phadatare',
    roleClass: 'Rune Architect',
    level: 1,
    status: 'In Guild Hall',
    isOnline: true,
    avatarSeed: 'ishant',
    avatarColor: '#06b6d4',
    currentXp: 0,
    maxXp: 500
  },
  {
    id: 'm2',
    name: 'Aviral Maurya',
    roleClass: 'Shadow Scholar',
    level: 1,
    status: 'In Guild Hall',
    isOnline: true,
    avatarSeed: 'aviral',
    avatarColor: '#38bdf8',
    currentXp: 0,
    maxXp: 500
  },
  {
    id: 'm3',
    name: 'Ajay Gurjar',
    roleClass: 'Arcane Healer',
    level: 1,
    status: 'In Guild Hall',
    isOnline: true,
    avatarSeed: 'ajay',
    avatarColor: '#a855f7',
    currentXp: 0,
    maxXp: 500
  },
  {
    id: 'm4',
    name: 'Eknaath Bawane',
    roleClass: 'Blade of Logic',
    level: 1,
    status: 'In Guild Hall',
    isOnline: true,
    avatarSeed: 'eknaath',
    avatarColor: '#ef4444',
    currentXp: 0,
    maxXp: 500
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    userName: 'Mentor Astra',
    userAvatarSeed: 'Mentor Astra',
    userAvatarColor: '#14b8a6',
    actionText: 'welcomed adventurers to',
    target: 'Shadow Protocol Guild Hall',
    timestamp: 'Just now',
    type: 'study'
  }
];

export const INITIAL_STUDY_ROOMS: StudyRoom[] = [
  {
    id: 'study-sanctuary',
    name: 'SQL Sanctuary & Database Core',
    onlineCount: 4,
    maxCapacity: 6,
    topic: 'PostgreSQL Joins & Query Devourer Raid Prep',
    initialTimeSeconds: 18 * 60 + 42,
    tag: 'Database',
    description: 'Collaborative query optimization, indexing benchmarks, and join labyrinth practice.',
    isScreenSharing: true,
    activeMembers: [
      { name: 'Aviral Maurya', avatarSeed: 'aviral', avatarColor: '#38bdf8' },
      { name: 'Eknaath Bawane', avatarSeed: 'eknaath', avatarColor: '#ef4444' },
      { name: 'Ishant Phadatare', avatarSeed: 'ishant', avatarColor: '#06b6d4' },
      { name: 'Ajay Gurjar', avatarSeed: 'ajay', avatarColor: '#a855f7' }
    ],
    isLive: true
  },
  {
    id: 'python-algorithms',
    name: 'Python & Algorithms Chamber',
    onlineCount: 3,
    maxCapacity: 8,
    topic: 'Dynamic Programming & LeetCode Hard Sprints',
    initialTimeSeconds: 26 * 60 + 10,
    tag: 'Python & DSA',
    description: 'Deep focus chamber solving recursive memoization, graph traversal, and sliding windows.',
    isScreenSharing: true,
    activeMembers: [
      { name: 'Aviral Maurya', avatarSeed: 'aviral', avatarColor: '#38bdf8' },
      { name: 'Ishant Phadatare', avatarSeed: 'ishant', avatarColor: '#06b6d4' },
      { name: 'Ajay Gurjar', avatarSeed: 'ajay', avatarColor: '#a855f7' }
    ],
    isLive: true
  },
  {
    id: 'systems-architecture',
    name: 'Systems & Git DevOps Lab',
    onlineCount: 2,
    maxCapacity: 8,
    topic: 'Distributed Systems & Merge Conflict War-Room',
    initialTimeSeconds: 34 * 60 + 15,
    tag: 'DevOps & Git',
    description: 'Live branch rebasing, containerized microservices debugging, and CI/CD pipelines.',
    isScreenSharing: false,
    activeMembers: [
      { name: 'Eknaath Bawane', avatarSeed: 'eknaath', avatarColor: '#ef4444' },
      { name: 'Ajay Gurjar', avatarSeed: 'ajay', avatarColor: '#a855f7' }
    ],
    isLive: true
  },
  {
    id: 'maths-foundations',
    name: 'Discrete Math & Logic Temple',
    onlineCount: 2,
    maxCapacity: 6,
    topic: 'Induction Proofs, Graph Theory & Matrix Math',
    initialTimeSeconds: 15 * 60 + 30,
    tag: 'Mathematics',
    description: 'Formal mathematical proofs, combinatorics, and asymptotic complexity derivation.',
    isScreenSharing: false,
    activeMembers: [
      { name: 'Aviral Maurya', avatarSeed: 'aviral', avatarColor: '#38bdf8' },
      { name: 'Eknaath Bawane', avatarSeed: 'eknaath', avatarColor: '#ef4444' }
    ],
    isLive: true
  }
];

export const INITIAL_STUDY_ROOM: StudyRoom = INITIAL_STUDY_ROOMS[0];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-welcome',
    title: 'Welcome to GuildUp!',
    desc: 'Your party is assembled. Select a quest from the curriculum board or join a Study Chamber.',
    time: 'Just now',
    unread: true,
    type: 'party',
    targetTab: 'guild_hall'
  }
];

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
