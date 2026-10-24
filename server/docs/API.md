# GuildUp REST API Specification (`/api/v1`)

All endpoints are prefixed with `/api/v1`.
All JSON request bodies are validated with Zod.
All errors follow the format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": null
  }
}
```

---

## 1. Authentication (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | None | Register a new user (`email`, `password`, `name`, `handle`, `roleClass`, `avatarSeed`, `avatarColor`). Returns JWT access token (15m) + sets `refreshToken` in httpOnly cookie. |
| `POST` | `/auth/login` | None | Authenticate with `email` and `password`. Returns access token + sets rotating refresh cookie. |
| `POST` | `/auth/refresh` | Cookie | Rotates refresh token, detects token reuse, issues new 15m access token. |
| `POST` | `/auth/logout` | User | Revokes the current refresh token and clears cookie. |
| `POST` | `/auth/logout-all` | User | Revokes all active refresh tokens for the user (emits `session:revoked`). |
| `GET` | `/auth/sessions` | User | Lists active sessions (device label, user agent, IP, last used). |
| `DELETE` | `/auth/sessions/:id` | User | Revokes a specific session by ID. |

---

## 2. Users (`/api/v1/users`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users/me` | User | Returns the current user's profile matching `UserProfile` frontend shape. |
| `PATCH` | `/users/me` | User | Updates editable user profile fields (`name`, `roleClass`, `avatarSeed`, `avatarColor`, `bio`). |
| `PATCH` | `/users/me/settings` | User | Updates user settings (`theme`, `soundEnabled`, `volume`, `chimeEnabled`, `weeklyGoalMinutes`, `recentSearches`, `notificationPrefs`). |
| `GET` | `/users/me/stats` | User | Returns XP, levels, streak, weekly progress breakdown, and mastery score. |
| `GET` | `/users/:id` | User | Fetches public profile for a member. |

---

## 3. Guilds (`/api/v1/guilds`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/guilds/mine` | User | Returns the list of guilds the authenticated user belongs to. |
| `POST` | `/guilds` | User | Creates a new guild (`name`, `tag`, `description`, `emblemIcon`, `emblemColor`). Creator becomes `OWNER`. |
| `POST` | `/guilds/join` | User | Joins a guild using its 6-character `inviteCode`. |
| `GET` | `/guilds/:id` | Member | Returns guild details matching frontend `Guild` shape. |
| `GET` | `/guilds/:id/members` | Member | Lists all guild members with real-time presence derived from Redis. |
| `PATCH` | `/guilds/:id` | Owner | Updates guild metadata (name, description, emblem). |
| `DELETE` | `/guilds/:id/members/:userId` | Owner/Self | Leaves guild or removes member. |
| `POST` | `/guilds/:id/invite-code/rotate`| Owner | Generates a new unique invite code. |
| `GET` | `/guilds/:id/activity` | Member | Fetches the paginated guild activity feed (`ActivityItem[]`). |

---

## 4. Friends (`/api/v1/friends`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/friends` | User | Lists user's friends with live presence status. |
| `POST` | `/friends/:userId` | User | Sends a friend request. |
| `POST` | `/friends/:userId/accept`| User | Accepts an incoming friend request. |
| `DELETE` | `/friends/:userId` | User | Removes friend or rejects request. |

---

## 5. Quests (`/api/v1/quests`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/quests` | User | Returns all quests, optionally filtered by `?track=`. Steps annotated with completion status. |
| `GET` | `/quests/:id` | User | Returns detailed quest object including step descriptions. |
| `POST` | `/quests/:id/start` | User | Marks quest status as `IN_PROGRESS`. |
| `POST` | `/quests/:id/steps/:stepIndex/complete` | User | Completes a single step. Grants fractional XP via `grantXp`. Idempotent. |
| `POST` | `/quests/:id/complete` | User | Completes quest after all steps are done. Grants remainder XP. Idempotent. |
| `GET` | `/quests/:id/challenge` | User | Fetches Astra's hint coding challenge for the quest. |
| `POST` | `/challenges/:id/attempt`| User | Submits multiple choice answer. Grants reward XP if correct. |

---

## 6. Study Rooms (`/api/v1/study-rooms`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/study-rooms` | Member | Returns active chambers in the user's guild. |
| `POST` | `/study-rooms` | Member | Creates a new study chamber (`name`, `topic`, `maxCapacity`, `initialTimeSeconds`). |
| `GET` | `/study-rooms/:id` | Member | Returns chamber state, current timer, participants. |
| `POST` | `/study-rooms/:id/join` | Member | Joins chamber. Emits `study:participants` and `presence:update`. |
| `POST` | `/study-rooms/:id/leave` | Member | Leaves chamber. Emits participant updates. |
| `DELETE`| `/study-rooms/:id` | Owner | End Chamber: ends the session for everyone, writes study minutes. |
| `POST` | `/study-rooms/:id/timer` | Member | Controls timer (`start`, `pause`, `resume`, `reset`, `skip`). |
| `GET` | `/study-rooms/:id/whiteboard`| Member | Replays strokes for late joiners. |
| `POST` | `/study-rooms/:id/livekit-token`| Member | Mints a LiveKit participant token. |
| `POST` | `/study-rooms/:id/minigames/:game/score`| Member | Submits mini-game score. Grants mini-game XP. |
| `POST` | `/webhooks/livekit` | Webhook | Webhook from LiveKit server on participant join/leave/mute. |

---

## 7. Chat Channels & Messages (`/api/v1/chat`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/channels` | Member | Lists all guild and room chat channels. |
| `GET` | `/chat/:channelId/messages`| Member | Cursor-paginated message history (`?before=<ulid>&limit=50`). |
| `POST` | `/chat/:channelId/messages`| Member | Sends a new message (`text`, `codeSnippet`, `clientMsgId`). Dedupes on `clientMsgId`. |
| `PATCH`| `/chat/messages/:id` | Author | Edits message text/code. |
| `DELETE`| `/chat/messages/:id` | Author/Admin | Soft deletes message. |
| `POST` | `/chat/messages/:id/reactions`| Member | Toggles an emoji reaction. |
| `POST` | `/chat/:channelId/read` | Member | Updates user's read receipt marker. |

---

## 8. Whispers (`/api/v1/whispers`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/whispers` | User | Lists conversations with other party members and Astra with unread counts. |
| `GET` | `/whispers/:memberId` | User | Cursor-paginated direct message history. |
| `POST` | `/whispers/:memberId` | User | Sends whisper (`text`, `clientMsgId`). Triggers Astra auto-reply if recipient is Astra. |
| `POST` | `/whispers/:memberId/read`| User | Marks conversation as read. Emits `whisper:read`. |

---

## 9. Boss Arena (`/api/v1/boss`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/boss/current` | Member | Returns active boss encounter state, phase, HP bar, ability names. |
| `POST` | `/boss/attack` | Member | Executes ability attack (`abilityName`). Enforces 30s ability cooldown. Calculates damage & crits. |
| `GET` | `/boss/logs` | Member | Recent combat raid event log. |
| `GET` | `/boss/history` | Member | Past defeated boss encounters. |

---

## 10. Leaderboard (`/api/v1/leaderboard`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/leaderboard/weekly` | Member | Weekly guild XP ranking with rank deltas from Redis sorted set. |
| `GET` | `/leaderboard/all-time`| Member | All-time guild XP leaderboard. |
| `GET` | `/leaderboard/streaks` | Member | Study streak leaderboard. |

---

## 11. Achievements & Notifications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/achievements` | User | All achievements with user progress and unlocked status. |
| `GET` | `/notifications` | User | List of notifications with unread counts. |
| `POST` | `/notifications/:id/read` | User | Mark single notification as read. |
| `POST` | `/notifications/read-all` | User | Mark all notifications as read. |

---

## 12. Search & System

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/search?q=&type=` | Member | Search across quests, members, channels, chambers, boss using `pg_trgm`. |
| `GET` | `/health` | None | Liveness check (HTTP 200). |
| `GET` | `/ready` | None | Readiness check (validates DB & Redis connections). |
| `GET` | `/system/network-info` | Dev Only | Host IP, port, and QR code URL for multi-device demo. |
