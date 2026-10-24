import { PrismaClient, QuestDifficulty, AchievementTier } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('🌱 Starting GuildUp master seed...');

  const passwordHash = await argon2.hash('ScholarPass123!');

  // 1. Party Members & NPC Astra
  const usersData = [
    {
      id: 'usr-ishant-1',
      email: 'ishant@guildup.dev',
      handle: 'ishant',
      name: 'Ishant Phadatare',
      roleClass: 'Rune Architect',
      level: 12,
      currentXp: 420,
      maxXp: 800,
      totalXp: 5420,
      dailyStreak: 5,
      avatarSeed: 'ishant',
      avatarColor: '#06b6d4',
      masteryScore: 68,
      passwordHash
    },
    {
      id: 'usr-aviral-2',
      email: 'aviral@guildup.dev',
      handle: 'aviral',
      name: 'Aviral Maurya',
      roleClass: 'Shadow Scholar',
      level: 14,
      currentXp: 690,
      maxXp: 950,
      totalXp: 7890,
      dailyStreak: 14,
      avatarSeed: 'aviral',
      avatarColor: '#38bdf8',
      masteryScore: 82,
      passwordHash
    },
    {
      id: 'usr-eknaath-3',
      email: 'eknaath@guildup.dev',
      handle: 'eknaath',
      name: 'Eknaath Bawane',
      roleClass: 'Blade of Logic',
      level: 13,
      currentXp: 510,
      maxXp: 880,
      totalXp: 6510,
      dailyStreak: 10,
      avatarSeed: 'eknaath',
      avatarColor: '#10b981',
      masteryScore: 75,
      passwordHash
    },
    {
      id: 'usr-ajay-4',
      email: 'ajay@guildup.dev',
      handle: 'ajay',
      name: 'Ajay Gurjar',
      roleClass: 'Arcane Healer',
      level: 13,
      currentXp: 380,
      maxXp: 880,
      totalXp: 6380,
      dailyStreak: 7,
      avatarSeed: 'ajay',
      avatarColor: '#f59e0b',
      masteryScore: 71,
      passwordHash
    },
    {
      id: 'usr-astra-npc',
      email: 'astra@guildup.dev',
      handle: 'astra',
      name: 'Mentor Astra',
      roleClass: 'Chief Mentor NPC',
      level: 99,
      currentXp: 99999,
      maxXp: 99999,
      totalXp: 999999,
      dailyStreak: 99,
      avatarSeed: 'Mentor Astra',
      avatarColor: '#14b8a6',
      masteryScore: 100,
      passwordHash
    }
  ];

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: u,
      create: {
        ...u,
        settings: {
          create: {
            theme: 'DARK',
            soundEnabled: true,
            volume: 80,
            chimeEnabled: true,
            weeklyGoalMinutes: 600,
            recentSearches: ['Learning Python', 'Aviral Maurya', 'Git & GitHub', 'The Query Devourer']
          }
        }
      }
    });
  }

  // 2. Default Guild: Shadow Protocol
  const guild = await prisma.guild.upsert({
    where: { id: 'shadow-protocol' },
    update: {},
    create: {
      id: 'shadow-protocol',
      name: 'Shadow Protocol',
      tag: 'SP',
      level: 4,
      currentXp: 2480,
      maxXp: 6000,
      description: 'Six weeks to master SQL & Distributed Systems. Four adventurers. One legendary challenge.',
      emblemColor: '#06b6d4',
      emblemIcon: 'shield',
      inviteCode: 'SP2026',
      createdBy: 'usr-ishant-1'
    }
  });

  // Guild Members
  const members = [
    { guildId: guild.id, userId: 'usr-ishant-1', role: 'OWNER' as const },
    { guildId: guild.id, userId: 'usr-aviral-2', role: 'OFFICER' as const },
    { guildId: guild.id, userId: 'usr-eknaath-3', role: 'OFFICER' as const },
    { guildId: guild.id, userId: 'usr-ajay-4', role: 'SCHOLAR' as const }
  ];

  for (const m of members) {
    await prisma.guildMember.upsert({
      where: { guildId_userId: { guildId: m.guildId, userId: m.userId } },
      update: { role: m.role },
      create: m
    });
  }

  // Friendships
  const friendPairs = [
    ['usr-ishant-1', 'usr-aviral-2'],
    ['usr-ishant-1', 'usr-eknaath-3'],
    ['usr-ishant-1', 'usr-ajay-4'],
    ['usr-aviral-2', 'usr-eknaath-3'],
    ['usr-aviral-2', 'usr-ajay-4'],
    ['usr-eknaath-3', 'usr-ajay-4']
  ];

  for (const [u1, u2] of friendPairs) {
    await prisma.friendship.upsert({
      where: { userId_friendId: { userId: u1, friendId: u2 } },
      update: { status: 'ACCEPTED' },
      create: { userId: u1, friendId: u2, status: 'ACCEPTED' }
    });
  }

  // 3. Real Curricula Quests
  const questsData = [
    {
      id: 'quest-python-1',
      category: 'Learning Python',
      title: 'Python Core & Scripting',
      description: 'Master variables, data structures, list comprehensions, and idiomatic Python control flow.',
      difficulty: QuestDifficulty.COMMON,
      rewardXp: 120,
      duration: '25 min',
      objective: 'Write automated data parsing scripts using dictionaries, sets, and list comprehensions.',
      steps: [
        { id: 1, text: 'Configure virtual environment and poetry dependencies' },
        { id: 2, text: 'Transform raw datasets using list & dict comprehensions' },
        { id: 3, text: 'Implement robust error handling with custom exceptions' },
        { id: 4, text: 'Build generator functions to stream large memory blocks' }
      ],
      position: 1
    },
    {
      id: 'quest-python-2',
      category: 'Learning Python',
      title: 'Object-Oriented Python Architecture',
      description: 'Design modular classes, dunder methods, polymorphism, and dependency injection patterns.',
      difficulty: QuestDifficulty.RARE,
      rewardXp: 220,
      duration: '35 min',
      objective: 'Implement an extensible domain model with encapsulation and custom iterators.',
      steps: [
        { id: 1, text: 'Define class schemas with @dataclass and type hints' },
        { id: 2, text: 'Override __repr__, __eq__, and __hash__ dunder methods' },
        { id: 3, text: 'Construct abstract base classes using the abc module' },
        { id: 4, text: 'Verify composition over inheritance with unit tests' }
      ],
      position: 2
    },
    {
      id: 'quest-prog-1',
      category: 'Computer Programming',
      title: 'Algorithmic Complexity & Big-O',
      description: 'Analyze time and space complexity bounds, recursion trees, and master master theorem.',
      difficulty: QuestDifficulty.COMMON,
      rewardXp: 200,
      duration: '30 min',
      objective: 'Derive asymptotic upper and lower bounds for divide-and-conquer recurrence relations.',
      steps: [
        { id: 1, text: 'Profile O(N) vs O(N log N) sorting algorithms with benchmarks' },
        { id: 2, text: 'Solve recurrence relations using substitution and recurrence tree' },
        { id: 3, text: 'Optimize dynamic programming memoization tables for space reduction' }
      ],
      position: 3
    },
    {
      id: 'quest-prog-2',
      category: 'Computer Programming',
      title: 'Design Patterns & Clean Code',
      description: 'Implement Factory, Singleton, Strategy, and Observer design patterns with SOLID principles.',
      difficulty: QuestDifficulty.RARE,
      rewardXp: 250,
      duration: '40 min',
      objective: 'Architect a decoupled event-driven system with loose coupling and high cohesion.',
      steps: [
        { id: 1, text: 'Apply Single Responsibility and Open/Closed principles to services' },
        { id: 2, text: 'Implement Strategy pattern for flexible payment gateways' },
        { id: 3, text: 'Build Observer pattern bus for real-time state pub/sub' },
        { id: 4, text: 'Conduct rigorous automated code review checks with linters' }
      ],
      position: 4
    },
    {
      id: 'quest-git-1',
      category: 'Git & GitHub',
      title: 'Git Branching & Merge Conflicts',
      description: 'Master rebase, cherry-pick, and three-way conflict resolutions without losing code history.',
      difficulty: QuestDifficulty.COMMON,
      rewardXp: 140,
      duration: '20 min',
      objective: 'Navigate complex branch divergence, squash commits, and resolve conflicting index hunks.',
      steps: [
        { id: 1, text: 'Execute interactive rebase with git rebase -i HEAD~4' },
        { id: 2, text: 'Resolve semantic merge conflicts using diff3 conflict style' },
        { id: 3, text: 'Cherry-pick critical bug fixes onto staging release branches' }
      ],
      position: 5
    },
    {
      id: 'quest-git-2',
      category: 'Git & GitHub',
      title: 'Open Source PRs & CI Workflows',
      description: 'Fork, branch, write conventional commits, and automate tests using GitHub Actions.',
      difficulty: QuestDifficulty.RARE,
      rewardXp: 190,
      duration: '30 min',
      objective: 'Submit production-grade pull requests with continuous integration matrix checks.',
      steps: [
        { id: 1, text: 'Fork upstream repository and configure remote tracking' },
        { id: 2, text: 'Formulate commits adhering to Conventional Commits standards' },
        { id: 3, text: 'Author GitHub Actions YAML pipeline for multi-OS testing' },
        { id: 4, text: 'Respond to code review feedback and push clean fixups' }
      ],
      position: 6
    },
    {
      id: 'quest-math-1',
      category: 'Mathematics',
      title: 'Discrete Mathematics & Proofs',
      description: 'Prove theorems using mathematical induction, graph theory invariants, and set relations.',
      difficulty: QuestDifficulty.EPIC,
      rewardXp: 280,
      duration: '45 min',
      objective: 'Establish rigorous formal proofs for algorithmic correctness and graph bipartiteness.',
      steps: [
        { id: 1, text: 'Prove summation identities via weak and strong induction' },
        { id: 2, text: 'Compute Euler paths and Hamiltonian cycle conditions on graphs' },
        { id: 3, text: 'Formulate equivalence relations and partial order sets (posets)' }
      ],
      position: 7
    },
    {
      id: 'quest-math-2',
      category: 'Mathematics',
      title: 'Linear Algebra for Computing',
      description: 'Master matrices, vector spaces, dot/cross products, eigenvalues, and PCA projections.',
      difficulty: QuestDifficulty.EPIC,
      rewardXp: 240,
      duration: '40 min',
      objective: 'Transform high-dimensional coordinates and diagonalize transition matrices.',
      steps: [
        { id: 1, text: 'Compute vector dot and cross products in high-dimensional spaces' },
        { id: 2, text: 'Calculate determinants, matrix inverses, and Gaussian elimination' },
        { id: 3, text: 'Find eigenvalues and eigenvectors of transition matrices' },
        { id: 4, text: 'Implement Principal Component Analysis (PCA) projection' }
      ],
      position: 8
    }
  ];

  for (const q of questsData) {
    await prisma.quest.upsert({
      where: { id: q.id },
      update: q,
      create: q
    });
  }

  // Seed user quest progress for Ishant
  await prisma.userQuestProgress.upsert({
    where: { userId_questId: { userId: 'usr-ishant-1', questId: 'quest-python-1' } },
    update: { completedSteps: [1, 2, 3], status: 'IN_PROGRESS' },
    create: { userId: 'usr-ishant-1', questId: 'quest-python-1', completedSteps: [1, 2, 3], status: 'IN_PROGRESS' }
  });

  await prisma.userQuestProgress.upsert({
    where: { userId_questId: { userId: 'usr-ishant-1', questId: 'quest-git-1' } },
    update: { completedSteps: [1, 2], status: 'IN_PROGRESS' },
    create: { userId: 'usr-ishant-1', questId: 'quest-git-1', completedSteps: [1, 2], status: 'IN_PROGRESS' }
  });

  // 4. Default Guild Chat Channels
  const channelsData = [
    { id: 'ch-sql-joins', slug: 'sql-joins', name: 'sql-joins-room', description: 'Inner, Left, Cross joins and Cartesian resolution', position: 1 },
    { id: 'ch-general-study', slug: 'general-study', name: 'general-study', description: 'Daily study goals, accountability & chill lofi', position: 2 },
    { id: 'ch-boss-tactics', slug: 'boss-tactics', name: 'boss-raid-tactics', description: 'Query Devourer Phase 2 B-Tree strategy', position: 3 },
    { id: 'ch-code-review', slug: 'code-review', name: 'schema-reviews', description: '3NF normalization & index performance logs', position: 4 }
  ];

  for (const c of channelsData) {
    await prisma.chatChannel.upsert({
      where: { guildId_slug: { guildId: guild.id, slug: c.slug } },
      update: c,
      create: { ...c, guildId: guild.id, scope: 'GUILD' }
    });
  }

  // 5. Boss Encounter: The Query Devourer
  const boss = await prisma.bossEncounter.upsert({
    where: { id: 'boss-query-devourer' },
    update: {},
    create: {
      id: 'boss-query-devourer',
      guildId: guild.id,
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

  // 6. Study Rooms
  const roomsData = [
    {
      id: 'room-sql-sanctuary',
      name: 'SQL Sanctuary & Database Core',
      topic: 'PostgreSQL Joins & Query Devourer Raid Prep',
      maxCapacity: 12,
      isLive: true,
      ownerId: 'usr-ishant-1'
    },
    {
      id: 'room-python-algo',
      name: 'Python & Algorithms Chamber',
      topic: 'Dynamic Programming & LeetCode Hard Sprints',
      maxCapacity: 8,
      isLive: true,
      ownerId: 'usr-aviral-2'
    },
    {
      id: 'room-devops-lab',
      name: 'Systems & Git DevOps Lab',
      topic: 'Distributed Systems & Merge Conflict War-Room',
      maxCapacity: 6,
      isLive: true,
      ownerId: 'usr-eknaath-3'
    },
    {
      id: 'room-math-temple',
      name: 'Discrete Math & Logic Temple',
      topic: 'Induction Proofs & Matrix Theory',
      maxCapacity: 10,
      isLive: true,
      ownerId: 'usr-ajay-4'
    }
  ];

  for (const r of roomsData) {
    await prisma.studyRoom.upsert({
      where: { id: r.id },
      update: r,
      create: { ...r, guildId: guild.id }
    });
  }

  // 7. Achievements
  const achievementsData = [
    { id: 'ach-first-quest', key: 'FIRST_QUEST', tier: AchievementTier.BRONZE, title: 'Initiate Scholar', description: 'Complete your first curriculum quest step', rewardXp: 50, criteria: { type: 'QUEST_COUNT', target: 1 } },
    { id: 'ach-streak-7', key: 'STREAK_7', tier: AchievementTier.SILVER, title: 'Iron Discipline', description: 'Maintain a 7-day continuous study streak', rewardXp: 200, criteria: { type: 'STREAK_DAYS', target: 7 } },
    { id: 'ach-boss-slayer', key: 'BOSS_SLAYER', tier: AchievementTier.GOLD, title: 'Index Cleaver', description: 'Deal 5,000+ damage to The Query Devourer', rewardXp: 500, criteria: { type: 'BOSS_DAMAGE_TOTAL', target: 5000 } },
    { id: 'ach-study-10h', key: 'STUDY_10H', tier: AchievementTier.SILVER, title: 'Focus Master', description: 'Log 600 minutes of productive study sanctuary time', rewardXp: 300, criteria: { type: 'STUDY_MINUTES', target: 600 } },
    { id: 'ach-mythic-scholar', key: 'MYTHIC_SCHOLAR', tier: AchievementTier.MYTHIC, title: 'Grand Archon', description: 'Reach Level 20 and complete all core tracks', rewardXp: 1500, criteria: { type: 'XP_TOTAL', target: 20000 } }
  ];

  for (const a of achievementsData) {
    await prisma.achievement.upsert({
      where: { id: a.id },
      update: a,
      create: a
    });
  }

  console.log('✅ GuildUp master seed completed successfully.');
}

if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
