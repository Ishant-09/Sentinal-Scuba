# GuildUp Backend Build Progress & Roadmap

## Overview
This document tracks the phased construction of the GuildUp production backend (`/server`) and frontend real-time integration as specified in the Antigravity prompt.

---

## Phase Status Summary

- [x] **Phase 0: Audit & Plan**
  - Audited `src/types/index.ts`, `src/data/mockData.ts`, views, and real-time requirements.
  - Generated `server/docs/API.md` (complete REST documentation) and `server/docs/EVENTS.md` (complete Socket.IO event catalog).
  - Documented schema mappings and type adaptations.

- [x] **Phase 1: Foundation**
  - `docker-compose.yml` configured for PostgreSQL 16 (`pg_trgm`), Redis 7, LiveKit SFU server, and GuildUp server.
  - Prisma schema with all 25 models, indexes, composite primary keys, and relations.
  - Comprehensive seed script `prisma/seed.ts` seeding 4 party members (**Ishant Phadatare**, **Aviral Maurya**, **Eknaath Bawane**, **Ajay Gurjar**) + NPC mentor **Astra**, default guild **Shadow Protocol**, 8 curriculum quests, 4 study rooms, 4 default chat channels, **The Query Devourer** boss encounter, and achievements.
  - Environment validation using Zod (`server/src/config/env.ts`).
  - Argon2id password hashing + JWT access tokens (15-min TTL) + rotating refresh token in httpOnly cookies.
  - In-memory Redis fallback engine for local non-Docker development environments.
  - Express app with Helmet, CORS, rate limiting, and `/health`, `/ready`, `/system/network-info` endpoints.

- [x] **Phase 2: Core Progression**
  - Transactional, idempotent `grantXp` pipeline with carry-over level-up loop.
  - Quests & step completion engine with fractional step XP and completion bonuses.
  - Guild roster, membership role management, invite code generation/rotation, and activity feed.
  - Friendship requests, acceptance, and roster management.
  - Achievements progression and notification engine.

- [x] **Phase 3: Socket Layer**
  - Socket.IO 4 server with JWT handshake authentication and user/guild/channel/study/boss room routing.
  - Redis presence tracking with 2-second debounce for quick page reloads.
  - Reconnection backfill handler (`sync:resume`).
  - Chat channels with cursor pagination, reactions, typing indicators, and `clientMsgId` deduplication.
  - Direct whispers module with automated Mentor Astra NPC replies (1200ms delay + typing indicators).

- [x] **Phase 4: Competition**
  - Redis sorted set weekly leaderboard with ISO week keys (`leaderboard:weekly:<year>-W<week>`) and DB rebuild fallback.
  - Atomic multi-phase boss raid engine (**The Query Devourer**) with formula damage calculation: `abilityBase + floor(level / 2) + floor(xpEarnedLast24h / 20)`.
  - 10% critical strike chance (2x damage) and 30-second Redis cooldown per ability.

- [x] **Phase 5: Study Chambers**
  - Study room lifecycle (creation, join, leave, End Chamber with owner eviction).
  - Synchronized server-authoritative study timers.
  - Whiteboard stroke recording and replay (`/study-rooms/:id/whiteboard`).
  - Mini-game score submission (`/study-rooms/:id/minigames/:game/score`).
  - LiveKit access token issuance (`/study-rooms/:id/livekit-token`).

- [x] **Phase 6: Multi-Device & Polish**
  - Vite proxy configuration for `/api` and `/socket.io` targeting `localhost:4000`.
  - `MultiDeviceConnectModal` with live LAN IP and QR code generation for seamless mobile Wi-Fi pair-testing.
  - TopNavbar connection status indicator (`Live`, `Connecting...`, `Offline`).
  - Anime-inspired `AuthModal` with 1-click presenter demo logins for Ishant, Aviral, Eknaath, and Ajay.
  - Dark and Light mode synchronization.

- [x] **Phase 7: Hardening & Acceptance**
  - Automated Vitest test suite (`server/test/xp.test.ts`, `server/test/boss.test.ts`, `server/test/api.test.ts`) passing with 100% success.
  - Multi-stage production `server/Dockerfile` (Node 20 Alpine, unprivileged `nodejs` user, health checks).
  - Frontend TypeScript & Vite build passing with 0 errors (`npm run build`).
  - Server TypeScript build passing with 0 errors (`npm run build:server`).

---

## Type Adaptations & Schema Mappings (Phase 0 Audit)

1. **User Profile**:
   - Backend `users` table holds `totalXp`, `longestStreak`, `lastActiveDate`, `timezone`, and `lastSeenAt`.
   - Serializer adapts user models into the frontend `UserProfile` interface (`name`, `roleClass`, `level`, `currentXp`, `maxXp`, `dailyStreak`, `questsCompletedThisWeek`, `masteryScore`, `avatarSeed`, `avatarColor`).

2. **Guild Members & Presence**:
   - `guild_members` table stores membership roles (`OWNER`, `OFFICER`, `SCHOLAR`).
   - Member online status (`'Online' | 'In a quest' | 'In Study Room' | 'In Boss Arena' | 'Offline'`) is dynamically derived from live Redis presence keys and chamber activity rather than stored statically in Postgres.

3. **Quests & Step Progress**:
   - `quests` stores template steps as JSONB (`{ id, title, detail }[]`).
   - When queried, `user_quest_progress.completedSteps` is joined and mapped to `steps: { id, text, completed: boolean }[]` matching frontend `Quest`.

4. **Chat & Whispers**:
   - Messages use time-sortable ULIDs for robust cursor pagination.
   - Timestamps are formatted to 24h clock (`HH:mm`) on serialization.
