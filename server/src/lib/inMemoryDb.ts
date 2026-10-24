import { ulid } from 'ulid';

const HASHED_PASS = '$argon2id$v=19$m=65536,t=3,p=4$fjVpIFkkVFNE49im87sCkQ$/5DY93fLyL10cTX83YlRudBPPbewSx9U09BDuh83rwo';

export class InMemoryDb {
  public users: any[] = [
    {
      id: 'usr-ishant-1',
      email: 'ishant@guildup.dev',
      handle: 'ishant',
      name: 'Ishant Phadatare',
      roleClass: 'Rune Architect',
      level: 1,
      currentXp: 0,
      maxXp: 500,
      totalXp: 0,
      dailyStreak: 0,
      avatarSeed: 'ishant',
      avatarColor: '#06b6d4',
      masteryScore: 0,
      passwordHash: HASHED_PASS,
      settings: {
        theme: 'DARK',
        soundEnabled: true,
        volume: 80,
        chimeEnabled: true,
        weeklyGoalMinutes: 600,
        recentSearches: ['Learning Python', 'Aviral Maurya', 'Git & GitHub', 'The Query Devourer']
      }
    },
    {
      id: 'usr-aviral-2',
      email: 'aviral@guildup.dev',
      handle: 'aviral',
      name: 'Aviral Maurya',
      roleClass: 'Shadow Scholar',
      level: 1,
      currentXp: 0,
      maxXp: 500,
      totalXp: 0,
      dailyStreak: 0,
      avatarSeed: 'aviral',
      avatarColor: '#38bdf8',
      masteryScore: 0,
      passwordHash: HASHED_PASS,
      settings: {
        theme: 'DARK',
        soundEnabled: true,
        volume: 80,
        chimeEnabled: true,
        weeklyGoalMinutes: 600
      }
    },
    {
      id: 'usr-eknaath-3',
      email: 'eknaath@guildup.dev',
      handle: 'eknaath',
      name: 'Eknaath Bawane',
      roleClass: 'Blade of Logic',
      level: 1,
      currentXp: 0,
      maxXp: 500,
      totalXp: 0,
      dailyStreak: 0,
      avatarSeed: 'eknaath',
      avatarColor: '#10b981',
      masteryScore: 0,
      passwordHash: HASHED_PASS,
      settings: {
        theme: 'DARK',
        soundEnabled: true,
        volume: 80,
        chimeEnabled: true,
        weeklyGoalMinutes: 600
      }
    },
    {
      id: 'usr-ajay-4',
      email: 'ajay@guildup.dev',
      handle: 'ajay',
      name: 'Ajay Gurjar',
      roleClass: 'Arcane Healer',
      level: 1,
      currentXp: 0,
      maxXp: 500,
      totalXp: 0,
      dailyStreak: 0,
      avatarSeed: 'ajay',
      avatarColor: '#f59e0b',
      masteryScore: 0,
      passwordHash: HASHED_PASS,
      settings: {
        theme: 'DARK',
        soundEnabled: true,
        volume: 80,
        chimeEnabled: true,
        weeklyGoalMinutes: 600
      }
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
      passwordHash: HASHED_PASS,
      settings: {
        theme: 'DARK',
        soundEnabled: true,
        volume: 80,
        chimeEnabled: true,
        weeklyGoalMinutes: 600
      }
    }
  ];

  public sessions: any[] = [];

  public guilds: any[] = [
    {
      id: 'shadow-protocol',
      name: 'Shadow Protocol',
      tag: 'SHADOW',
      level: 1,
      currentXp: 0,
      maxXp: 3000,
      memberCount: 4,
      maxMembers: 12,
      onlineCount: 4,
      description: 'Elite study guild dedicated to algorithmic mastery, distributed systems, and low-latency databases.',
      emblemColor: '#06b6d4',
      emblemIcon: 'shield',
      inviteCode: 'SHADOW-PROTO-2026',
      weeklyGoalTarget: 2500,
      weeklyGoalCurrent: 0
    }
  ];

  public guildMembers: any[] = [
    { id: 'gm-1', guildId: 'shadow-protocol', userId: 'usr-ishant-1', role: 'OWNER', weeklyXp: 0 },
    { id: 'gm-2', guildId: 'shadow-protocol', userId: 'usr-aviral-2', role: 'OFFICER', weeklyXp: 0 },
    { id: 'gm-3', guildId: 'shadow-protocol', userId: 'usr-eknaath-3', role: 'SCHOLAR', weeklyXp: 0 },
    { id: 'gm-4', guildId: 'shadow-protocol', userId: 'usr-ajay-4', role: 'SCHOLAR', weeklyXp: 0 }
  ];

  public quests: any[] = [
    {
      id: 'quest-python-1',
      difficulty: 'COMMON',
      title: 'Python Core & Comprehensions',
      description: 'Master list, dict, and set comprehensions alongside generator pipelines for memory-efficient data processing.',
      rewardXp: 250,
      duration: '45 mins',
      progress: 0,
      maxProgress: 4,
      completed: false,
      category: 'Python',
      objective: 'Refactor procedural loops into clean, idiomatic Python comprehensions and generators.',
      steps: [
        { id: 1, text: 'Transform nested filtering loops into 2D list comprehensions', completed: false },
        { id: 2, text: 'Implement generator expression for chunked file streaming without memory exhaustion', completed: false },
        { id: 3, text: 'Benchmark memory allocation using tracemalloc and sys.getsizeof', completed: false },
        { id: 4, text: 'Build functional map/filter pipeline with functools.reduce', completed: false }
      ]
    },
    {
      id: 'quest-git-2',
      difficulty: 'RARE',
      title: 'Git & GitHub Collaborative Branching',
      description: 'Handle complex multi-developer Git flows including rebase, cherry-pick, conflict resolution, and bisect.',
      rewardXp: 350,
      duration: '60 mins',
      progress: 0,
      maxProgress: 4,
      completed: false,
      category: 'Git & GitHub',
      objective: 'Resolve 3-way merge conflicts and establish trunk-based feature flags.',
      steps: [
        { id: 1, text: 'Execute interactive rebase to squash 5 messy commits into clean conventional commits', completed: false },
        { id: 2, text: 'Use git cherry-pick with -x flag to backport critical patch to release branch', completed: false },
        { id: 3, text: 'Resolve multi-file merge conflict using diff3 style and verify test suite', completed: false },
        { id: 4, text: 'Automate git bisect run with automated test script to isolate regression', completed: false }
      ]
    },
    {
      id: 'quest-math-3',
      difficulty: 'EPIC',
      title: 'Discrete Math & Logical Proofs',
      description: 'Formal mathematical induction, recurrence relations, and graph-theoretic proofs for computer science.',
      rewardXp: 450,
      duration: '90 mins',
      progress: 0,
      maxProgress: 4,
      completed: false,
      category: 'Mathematics',
      objective: 'Derive closed-form recurrence bounds and formal induction arguments.',
      steps: [
        { id: 1, text: 'Formulate weak and strong induction proofs for tree vertex-edge theorems', completed: false },
        { id: 2, text: 'Solve divide-and-conquer recurrence T(n)=2T(n/2)+O(n) via Master Theorem', completed: false },
        { id: 3, text: 'Construct truth tables and simplify Boolean logic to canonical CNF/DNF', completed: false },
        { id: 4, text: 'Prove Eulerian path existence conditions using vertex parity theorem', completed: false }
      ]
    },
    {
      id: 'quest-cs-4',
      difficulty: 'LEGENDARY',
      title: 'Computer Programming & Algorithmic Design',
      description: 'Advanced data structures: B+ Trees, Segment Trees, Trie optimizations, and LRU Cache implementations.',
      rewardXp: 600,
      duration: '120 mins',
      progress: 0,
      maxProgress: 4,
      completed: false,
      category: 'Computer Science',
      objective: 'Construct production-grade O(1) LRU Cache and cache-conscious B+ Tree nodes.',
      steps: [
        { id: 1, text: 'Implement O(1) get and put LRU Cache with hash table and doubly-linked list', completed: false },
        { id: 2, text: 'Implement Segment Tree with lazy propagation for dynamic range sum queries', completed: false },
        { id: 3, text: 'Profile CPU L1/L2 cache miss rate comparing array vs linked-list traversals', completed: false },
        { id: 4, text: 'Write lock-free concurrent queue using atomic compare-and-swap (CAS)', completed: false }
      ]
    }
  ];

  public userQuestProgressList: any[] = [];

  public studyRooms: any[] = [
    {
      id: 'study-sanctuary',
      name: 'SQL Sanctuary & Database Core',
      onlineCount: 4,
      maxCapacity: 6,
      topic: 'PostgreSQL Joins & Query Devourer Raid Prep',
      initialTimeSeconds: 1500,
      activeMembers: [
        { name: 'Ishant Phadatare', avatarSeed: 'ishant', avatarColor: '#06b6d4' },
        { name: 'Aviral Maurya', avatarSeed: 'aviral', avatarColor: '#38bdf8' },
        { name: 'Eknaath Bawane', avatarSeed: 'eknaath', avatarColor: '#10b981' },
        { name: 'Ajay Gurjar', avatarSeed: 'ajay', avatarColor: '#f59e0b' }
      ],
      isLive: true,
      tag: 'DATABASE_DEEP_DIVE',
      description: 'Collaborative query optimization, indexing benchmarks, and join labyrinth practice.',
      timerState: {
        mode: 'FOCUS',
        startedAt: null,
        durationMs: 1500000,
        pausedRemainingMs: 1500000,
        cycle: 1,
        paused: true
      }
    },
    {
      id: 'python-algorithms',
      name: 'Python & Algorithms Chamber',
      onlineCount: 3,
      maxCapacity: 8,
      topic: 'Dynamic Programming & LeetCode Hard Sprints',
      initialTimeSeconds: 1500,
      activeMembers: [
        { name: 'Ishant Phadatare', avatarSeed: 'ishant', avatarColor: '#06b6d4' },
        { name: 'Aviral Maurya', avatarSeed: 'aviral', avatarColor: '#38bdf8' },
        { name: 'Mentor Astra', avatarSeed: 'Mentor Astra', avatarColor: '#14b8a6' }
      ],
      isLive: true,
      tag: 'ALGORITHMS',
      description: 'Deep focus chamber solving recursive memoization, graph traversal, and sliding windows.',
      timerState: {
        mode: 'FOCUS',
        startedAt: null,
        durationMs: 1500000,
        pausedRemainingMs: 1500000,
        cycle: 1,
        paused: true
      }
    },
    {
      id: 'systems-architecture',
      name: 'Systems & Git DevOps Lab',
      onlineCount: 2,
      maxCapacity: 8,
      topic: 'Distributed Systems & Merge Conflict War-Room',
      initialTimeSeconds: 1500,
      activeMembers: [
        { name: 'Eknaath Bawane', avatarSeed: 'eknaath', avatarColor: '#ef4444' },
        { name: 'Ajay Gurjar', avatarSeed: 'ajay', avatarColor: '#a855f7' }
      ],
      isLive: true,
      tag: 'DEVOPS_GIT',
      description: 'Live branch rebasing, containerized microservices debugging, and CI/CD pipelines.',
      timerState: {
        mode: 'FOCUS',
        startedAt: null,
        durationMs: 1500000,
        pausedRemainingMs: 1500000,
        cycle: 1,
        paused: true
      }
    },
    {
      id: 'maths-foundations',
      name: 'Discrete Math & Logic Temple',
      onlineCount: 2,
      maxCapacity: 6,
      topic: 'Induction Proofs, Graph Theory & Matrix Math',
      initialTimeSeconds: 1500,
      activeMembers: [
        { name: 'Aviral Maurya', avatarSeed: 'aviral', avatarColor: '#38bdf8' },
        { name: 'Eknaath Bawane', avatarSeed: 'eknaath', avatarColor: '#ef4444' }
      ],
      isLive: true,
      tag: 'MATHEMATICS',
      description: 'Formal mathematical proofs, combinatorics, and asymptotic complexity derivation.',
      timerState: {
        mode: 'FOCUS',
        startedAt: null,
        durationMs: 1500000,
        pausedRemainingMs: 1500000,
        cycle: 1,
        paused: true
      }
    }
  ];

  public bossState: any = {
    id: 'boss-devourer-1',
    guildId: 'shadow-protocol',
    name: 'THE QUERY DEVOURER',
    subtitle: 'An ancient corrupted index entity consuming database clusters across the realm.',
    difficulty: 'LEGENDARY',
    element: 'Void / Latency',
    lore: 'Spawned from an unindexed trillion-row JOIN disaster in subterranean server vaults. Only perfectly optimized relational spells can shatter its core.',
    phaseCount: 3,
    currentPhase: 1,
    currentHp: 10000,
    maxHp: 10000,
    status: 'ACTIVE',
    phases: [
      { number: 1, name: 'Phase 1 — Unindexed Depths', status: 'active', bossHp: 10000, bossMaxHp: 10000 },
      { number: 2, name: 'Phase 2 — The Join Labyrinth', status: 'locked', bossHp: 20000, bossMaxHp: 20000 },
      { number: 3, name: 'Phase 3 — Transaction Deadlock', status: 'locked', bossHp: 30000, bossMaxHp: 30000 }
    ]
  };

  public bossRaidLogs: any[] = [];
  public chatMessages: any[] = [];
  public whisperMessages: any[] = [];
  public notifications: any[] = [];
  public achievements: any[] = [];
  public userAchievements: any[] = [];
  public friendships: any[] = [];
  public xpEvents: any[] = [];

  // Model-level query dispatchers
  public user = {
    findUnique: async (args: any) => {
      const { where } = args;
      if (where.id) return this.users.find((u) => u.id === where.id) || null;
      if (where.email) return this.users.find((u) => u.email.toLowerCase() === where.email.toLowerCase()) || null;
      if (where.handle) return this.users.find((u) => u.handle.toLowerCase() === where.handle.toLowerCase()) || null;
      return null;
    },
    findUniqueOrThrow: async (args: any) => {
      const res = await this.user.findUnique(args);
      if (!res) throw new Error('User not found');
      return res;
    },
    findFirst: async (args: any) => {
      const { where } = args || {};
      if (!where) return this.users[0] || null;
      if (where.OR && Array.isArray(where.OR)) {
        for (const cond of where.OR) {
          if (cond.email) {
            const m = this.users.find((u) => u.email.toLowerCase() === cond.email.toLowerCase());
            if (m) return m;
          }
          if (cond.handle) {
            const m = this.users.find((u) => u.handle.toLowerCase() === cond.handle.toLowerCase());
            if (m) return m;
          }
        }
      }
      return null;
    },
    findMany: async (args?: any) => {
      return [...this.users];
    },
    create: async (args: any) => {
      const newUser = {
        id: args.data.id || `usr-${ulid().toLowerCase()}`,
        ...args.data,
        level: args.data.level || 1,
        currentXp: args.data.currentXp || 0,
        maxXp: args.data.maxXp || 500,
        totalXp: args.data.totalXp || 0,
        dailyStreak: args.data.dailyStreak || 1,
        settings: {
          theme: 'DARK',
          soundEnabled: true,
          volume: 80,
          chimeEnabled: true,
          weeklyGoalMinutes: 600
        }
      };
      this.users.push(newUser);
      return newUser;
    },
    update: async (args: any) => {
      const { where, data } = args;
      const idx = this.users.findIndex((u) => u.id === where.id);
      if (idx === -1) throw new Error('User not found');
      this.users[idx] = { ...this.users[idx], ...data };
      return this.users[idx];
    },
    upsert: async (args: any) => {
      const existing = await this.user.findUnique(args);
      if (existing) {
        return this.user.update({ where: args.where, data: args.update });
      }
      return this.user.create({ data: { ...args.where, ...args.create } });
    },
    count: async () => this.users.length
  };

  public refreshToken = {
    create: async (args: any) => {
      const newSession = {
        id: args.data.id || ulid(),
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
        revokedAt: null
      };
      this.sessions.push(newSession);
      return newSession;
    },
    findUnique: async (args: any) => {
      const { where } = args;
      if (where.refreshTokenHash) {
        return this.sessions.find((s) => s.refreshTokenHash === where.refreshTokenHash) || null;
      }
      if (where.id) {
        return this.sessions.find((s) => s.id === where.id) || null;
      }
      return null;
    },
    findFirst: async (args: any) => {
      const { where } = args || {};
      if (where?.refreshTokenHash) {
        return (
          this.sessions.find(
            (s) => s.refreshTokenHash === where.refreshTokenHash && (!where.revokedAt || s.revokedAt === null)
          ) || null
        );
      }
      if (where?.id) {
        return this.sessions.find((s) => s.id === where.id) || null;
      }
      return this.sessions[0] || null;
    },
    delete: async (args: any) => {
      const { where } = args;
      this.sessions = this.sessions.filter((s) => s.id !== where.id);
      return { id: where.id };
    },
    deleteMany: async (args: any) => {
      const { where } = args;
      if (where?.userId) {
        this.sessions = this.sessions.filter((s) => s.userId !== where.userId);
      }
      return { count: 1 };
    },
    findMany: async (args?: any) => {
      if (args?.where?.userId) {
        return this.sessions.filter((s) => s.userId === args.where.userId);
      }
      return [...this.sessions];
    },
    update: async (args: any) => {
      const { where, data } = args;
      const idx = this.sessions.findIndex((s) => s.id === where.id);
      if (idx !== -1) {
        this.sessions[idx] = { ...this.sessions[idx], ...data };
        return this.sessions[idx];
      }
      return null;
    },
    updateMany: async (args: any) => {
      const { where, data } = args;
      let count = 0;
      this.sessions = this.sessions.map((s) => {
        if (where?.userId && s.userId === where.userId) {
          count++;
          return { ...s, ...data };
        }
        if (where?.id && s.id === where.id) {
          count++;
          return { ...s, ...data };
        }
        return s;
      });
      return { count };
    }
  };

  public userSettings = {
    findUnique: async (args: any) => {
      const user = this.users.find((u) => u.id === args?.where?.userId);
      return user?.settings || null;
    },
    upsert: async (args: any) => {
      const user = this.users.find((u) => u.id === args?.where?.userId);
      if (user) {
        user.settings = { ...user.settings, ...args.update };
        return user.settings;
      }
      return args.create;
    }
  };

  public guild = {
    findUnique: async (args: any) => {
      const { where } = args;
      return this.guilds.find((g) => g.id === where.id) || null;
    },
    findFirst: async (args: any) => {
      const { where } = args || {};
      if (where?.inviteCode) {
        return this.guilds.find((g) => g.inviteCode?.toUpperCase() === where.inviteCode.toUpperCase()) || null;
      }
      return this.guilds[0] || null;
    },
    findMany: async (args?: any) => {
      return [...this.guilds];
    },
    create: async (args: any) => {
      const newGuild = {
        id: args.data.id || `guild-${ulid().toLowerCase()}`,
        ...args.data,
        level: args.data.level || 1,
        currentXp: args.data.currentXp || 0,
        maxXp: args.data.maxXp || 3000,
        memberCount: 1,
        maxMembers: 12,
        onlineCount: 1
      };
      this.guilds.push(newGuild);
      return newGuild;
    },
    update: async (args: any) => {
      const { where, data } = args;
      const idx = this.guilds.findIndex((g) => g.id === where.id);
      if (idx !== -1) {
        this.guilds[idx] = { ...this.guilds[idx], ...data };
        return this.guilds[idx];
      }
      return null;
    },
    upsert: async (args: any) => {
      const existing = await this.guild.findUnique(args);
      if (existing) {
        return this.guild.update({ where: args.where, data: args.update });
      }
      return this.guild.create({ data: { ...args.where, ...args.create } });
    }
  };

  public guildMember = {
    findFirst: async (args: any) => {
      const { where } = args || {};
      if (where?.userId) {
        const gm = this.guildMembers.find((m) => m.userId === where.userId);
        if (gm) {
          const user = this.users.find((u) => u.id === gm.userId);
          const guild = this.guilds.find((g) => g.id === gm.guildId);
          return { ...gm, user, guild };
        }
      }
      return null;
    },
    findUnique: async (args: any) => {
      const { where } = args;
      if (where?.userId_guildId) {
        return (
          this.guildMembers.find(
            (m) => m.userId === where.userId_guildId.userId && m.guildId === where.userId_guildId.guildId
          ) || null
        );
      }
      return null;
    },
    findMany: async (args?: any) => {
      const guildId = args?.where?.guildId || 'shadow-protocol';
      const members = this.guildMembers.filter((m) => m.guildId === guildId);
      return members.map((m) => ({
        ...m,
        user: this.users.find((u) => u.id === m.userId)
      }));
    },
    create: async (args: any) => {
      const newMember = {
        id: args.data.id || `gm-${ulid().toLowerCase()}`,
        ...args.data,
        weeklyXp: 0
      };
      this.guildMembers.push(newMember);
      return newMember;
    },
    update: async (args: any) => {
      const { where, data } = args;
      const idx = this.guildMembers.findIndex(
        (m) => m.userId === where.userId_guildId.userId && m.guildId === where.userId_guildId.guildId
      );
      if (idx !== -1) {
        this.guildMembers[idx] = { ...this.guildMembers[idx], ...data };
        return this.guildMembers[idx];
      }
      return null;
    },
    delete: async (args: any) => {
      return { count: 1 };
    }
  };

  public activityEvent = {
    findMany: async () => [],
    create: async (args: any) => args.data
  };

  public quest = {
    findUnique: async (args: any) => {
      const { where } = args;
      return this.quests.find((q) => q.id === where.id) || null;
    },
    findMany: async (args?: any) => {
      return [...this.quests];
    },
    create: async (args: any) => {
      this.quests.push(args.data);
      return args.data;
    },
    count: async () => this.quests.length
  };

  public userQuestProgress = {
    findUnique: async (args: any) => {
      const { where } = args;
      if (where?.userId_questId) {
        return (
          this.userQuestProgressList.find(
            (p) => p.userId === where.userId_questId.userId && p.questId === where.userId_questId.questId
          ) || null
        );
      }
      return null;
    },
    findMany: async (args?: any) => {
      return [...this.userQuestProgressList];
    },
    create: async (args: any) => {
      const newProg = { ...args.data, id: ulid() };
      this.userQuestProgressList.push(newProg);
      return newProg;
    },
    update: async (args: any) => {
      const { where, data } = args;
      const idx = this.userQuestProgressList.findIndex(
        (p) => p.userId === where.userId_questId.userId && p.questId === where.userId_questId.questId
      );
      if (idx !== -1) {
        this.userQuestProgressList[idx] = { ...this.userQuestProgressList[idx], ...data };
        return this.userQuestProgressList[idx];
      }
      return null;
    },
    upsert: async (args: any) => {
      const existing = await this.userQuestProgress.findUnique(args);
      if (existing) {
        return this.userQuestProgress.update({ where: args.where, data: args.update });
      }
      return this.userQuestProgress.create({ data: { ...args.where.userId_questId, ...args.create } });
    },
    count: async () => this.userQuestProgressList.filter((p) => p.status === 'COMPLETED').length
  };

  public hintChallenge = {
    findFirst: async (args: any) => null,
    findUnique: async (args: any) => null,
    create: async (args: any) => args.data
  };

  public hintAttempt = {
    create: async (args: any) => args.data
  };

  public studyRoom = {
    findUnique: async (args: any) => {
      const { where } = args;
      const reqId = (where.id || '').toLowerCase();
      const room =
        this.studyRooms.find((r) => r.id === where.id) ||
        this.studyRooms.find((r) =>
          (reqId.includes('sanctuary') && r.id.includes('sanctuary')) ||
          (reqId.includes('algo') && r.id.includes('algo')) ||
          (reqId.includes('system') && r.id.includes('system')) ||
          (reqId.includes('math') && r.id.includes('math'))
        ) ||
        this.studyRooms[0] ||
        null;

      if (!room) return null;
      return {
        ...room,
        participants: room.activeMembers || []
      };
    },
    findFirst: async (args: any) => {
      const room = this.studyRooms[0] || null;
      if (!room) return null;
      return {
        ...room,
        participants: room.activeMembers || []
      };
    },
    findMany: async (args?: any) => {
      return this.studyRooms.map((r) => ({
        ...r,
        participants: r.activeMembers || []
      }));
    },
    create: async (args: any) => {
      const newRoom = {
        id: args.data.id || `room-${ulid().toLowerCase()}`,
        ...args.data,
        onlineCount: 1,
        activeMembers: []
      };
      this.studyRooms.push(newRoom);
      return newRoom;
    },
    update: async (args: any) => {
      const { where, data } = args;
      const idx = this.studyRooms.findIndex((r) => r.id === where.id);
      if (idx !== -1) {
        this.studyRooms[idx] = { ...this.studyRooms[idx], ...data };
        return this.studyRooms[idx];
      }
      return null;
    },
    delete: async (args: any) => {
      const { where } = args;
      this.studyRooms = this.studyRooms.filter((r) => r.id !== where.id);
      return { id: where.id };
    }
  };

  public studyParticipant = {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (args: any) => args.data,
    updateMany: async () => ({ count: 1 }),
    delete: async () => ({ count: 1 }),
    deleteMany: async () => ({ count: 1 })
  };

  public studySession = {
    create: async (args: any) => args.data,
    findMany: async () => []
  };

  public whiteboardStroke = {
    findMany: async () => [],
    create: async (args: any) => args.data
  };

  public minigameScore = {
    create: async (args: any) => args.data
  };

  public chatChannel = {
    findMany: async () => [
      { id: 'chan-1', name: 'general-study', topic: 'General focus and study discussions' },
      { id: 'chan-2', name: 'python-chamber', topic: 'Python language architecture and debugging' },
      { id: 'chan-3', name: 'sql-joins', topic: 'SQL relational indexes and execution plans' },
      { id: 'chan-4', name: 'algorithms', topic: 'LeetCode, graph theory, and algorithmic design' }
    ]
  };

  public chatMessage = {
    findMany: async (args?: any) => {
      return [...this.chatMessages];
    },
    create: async (args: any) => {
      const newMsg = {
        id: args.data.id || ulid(),
        ...args.data,
        createdAt: new Date(),
        reactions: []
      };
      this.chatMessages.push(newMsg);
      return newMsg;
    },
    update: async (args: any) => args.data
  };

  public chatReaction = {
    create: async (args: any) => args.data,
    delete: async () => ({ count: 1 })
  };

  public whisper = {
    findMany: async (args?: any) => {
      return [...this.whisperMessages];
    },
    create: async (args: any) => {
      const newMsg = {
        id: args.data.id || ulid(),
        ...args.data,
        createdAt: new Date()
      };
      this.whisperMessages.push(newMsg);
      return newMsg;
    },
    updateMany: async () => ({ count: 1 })
  };

  public bossEncounter = {
    findFirst: async () => {
      return this.bossState;
    },
    findUnique: async () => {
      return this.bossState;
    },
    create: async (args: any) => {
      this.bossState = args.data;
      return this.bossState;
    },
    update: async (args: any) => {
      this.bossState = { ...this.bossState, ...args.data };
      return this.bossState;
    }
  };

  public bossRaidLog = {
    findMany: async () => [...this.bossRaidLogs],
    create: async (args: any) => {
      const log = { id: ulid(), ...args.data, createdAt: new Date() };
      this.bossRaidLogs.unshift(log);
      return log;
    }
  };

  public xpEvent = {
    findUnique: async () => null,
    create: async (args: any) => {
      const event = { id: ulid(), ...args.data, createdAt: new Date() };
      this.xpEvents.push(event);
      return event;
    },
    findMany: async () => [...this.xpEvents]
  };

  public achievement = {
    findMany: async () => [...this.achievements],
    create: async (args: any) => args.data
  };

  public userAchievement = {
    findUnique: async () => null,
    findMany: async () => [...this.userAchievements],
    create: async (args: any) => args.data
  };

  public appNotification = {
    findMany: async () => [...this.notifications],
    create: async (args: any) => {
      const notif = { id: args.data.id || ulid(), ...args.data, createdAt: new Date() };
      this.notifications.unshift(notif);
      return notif;
    },
    update: async () => null,
    updateMany: async () => ({ count: 1 }),
    delete: async () => ({ count: 1 }),
    deleteMany: async () => ({ count: 1 })
  };

  public friendship = {
    findMany: async () => [...this.friendships],
    findFirst: async () => null,
    create: async (args: any) => args.data,
    update: async (args: any) => args.data,
    delete: async () => ({ count: 1 }),
    deleteMany: async () => ({ count: 1 })
  };

  public async $transaction(fn: any) {
    if (typeof fn === 'function') {
      return await fn(this);
    }
    return fn;
  }

  public async $connect() {
    return true;
  }

  public async $disconnect() {
    return true;
  }
}

export const inMemoryDb = new InMemoryDb();
