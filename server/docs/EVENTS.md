# GuildUp Socket.IO Event Catalog

The real-time layer uses Socket.IO 4 with Redis adapter.
Connections authenticate via the JWT access token provided in `auth.token`.

Rooms:
- `user:{userId}` — All devices of a user (settings, whispers, personal stats, notifications).
- `guild:{guildId}` — Guild-wide broadcast (activity feed, member presence, guild level/XP, chambers).
- `channel:{channelId}` — Specific chat channel (messages, typing, reactions).
- `study:{roomId}` — Active study chamber (participants, timer, whiteboard, Yjs notes, mini-games).
- `boss:{bossId}` — Boss arena combat (live HP, phase transitions, attack log).

---

## Server to Client Events

| Event | Room | Payload | Triggered By |
|---|---|---|---|
| `presence:update` | `guild:{guildId}` | `{ userId, status: 'Online'\|'In a quest'\|'In Study Room'\|'In Boss Arena'\|'Offline', activity }` | Connect, disconnect, chamber join/leave, boss view |
| `user:stats` | `user:{userId}` | `{ level, currentXp, maxXp, totalXp, dailyStreak, questsCompletedThisWeek, weeklyMinutes, weeklyGoalMinutes, masteryScore }` | Any XP grant, study session completion, streak update |
| `xp:gained` | `user:{userId}` | `{ amount, source, label, newXp, currentXp, maxXp }` | `grantXp` pipeline. Triggers toasts & confetti |
| `level:up` | `user:{userId}`, `guild:{guildId}` | `{ userId, userName, newLevel, oldLevel }` | User level-up event |
| `quest:progress` | `user:{userId}` | `{ questId, completedSteps: number[], status, progress, completed }` | Quest step completed or quest completed |
| `guild:stats` | `guild:{guildId}` | `{ level, currentXp, maxXp }` | Guild level / XP change |
| `guild:activity` | `guild:{guildId}` | `ActivityItem` | Quest completed, boss hit, level-up, achievement unlocked |
| `leaderboard:update`| `guild:{guildId}` | `{ entries: LeaderboardEntry[], updatedAt }` | XP change (throttled to 1/sec via Redis sorted set) |
| `chat:message` | `channel:{channelId}` | `ChatMessage` | User sends message in channel |
| `chat:message:update`| `channel:{channelId}`| `{ id, text, codeSnippet, editedAt }` | Message edited |
| `chat:message:delete`| `channel:{channelId}`| `{ id }` | Message soft deleted |
| `chat:reaction` | `channel:{channelId}` | `{ messageId, emoji, userId, added, counts, users }` | Reaction toggled on message |
| `chat:typing` | `channel:{channelId}` | `{ userId, userName, isTyping }` | Member typing event |
| `chat:unread` | `user:{userId}` | `{ channelId, count }` | Message received in unread channel |
| `whisper:new` | `user:{recipientId}`, `user:{senderId}` | `{ whisper: WhisperMessage, conversationId }` | Direct message sent (delivered to all devices of both parties) |
| `whisper:typing` | `user:{recipientId}` | `{ memberId, isTyping }` | Direct message typing indicator (also emitted by Astra NPC) |
| `whisper:read` | `user:{senderId}` | `{ memberId, readAt }` | Direct message read receipt |
| `boss:state` | `boss:{bossId}` | `BossEncounter` | Initial boss sync on subscribe |
| `boss:hit` | `boss:{bossId}` | `{ currentHp, maxHp, damage, isCrit, phaseNumber, logEntry: BossRaidLog }` | Player executes ability attack |
| `boss:phase` | `boss:{bossId}`, `guild:{guildId}` | `{ newPhase: number, phaseName: string }` | HP drops below phase threshold |
| `boss:defeated` | `boss:{bossId}`, `guild:{guildId}` | `{ bossName: string, rewardXp: number, topDamagers: any[] }` | Boss HP reaches 0 |
| `study:room` | `guild:{guildId}` | `{ action: 'created'\|'updated'\|'ended', room: StudyRoom }` | Chamber created, updated, or ended |
| `study:participants`| `study:{roomId}` | `{ participants: StudyParticipant[], onlineCount: number }` | Member joined/left chamber or voice toggled |
| `study:timer` | `study:{roomId}` | `{ mode: 'FOCUS'\|'BREAK', startedAt, durationMs, pausedRemainingMs, serverNow, cycle }` | Timer start, pause, resume, reset, or BullMQ phase flip |
| `study:notes` | `study:{roomId}` | `{ update: string (base64) }` | Yjs document collaborative binary delta |
| `study:strokes` | `study:{roomId}` | `{ strokes: WhiteboardStroke[] }` | Collaborative drawing stroke batch (50ms) |
| `study:clear` | `study:{roomId}` | `{ clearedBy: string }` | Whiteboard cleared |
| `study:ended` | `study:{roomId}` | `{ roomId: string, endedBy: string }` | End Chamber triggered |
| `minigame:score` | `study:{roomId}` | `{ userId, userName, game, score, highscore }` | Study break mini-game score submitted |
| `notification:new` | `user:{userId}` | `AppNotification` | Real-time notification delivered |
| `notification:read`| `user:{userId}` | `{ id: string }` | Notification read |
| `achievement:unlocked`| `user:{userId}` | `Achievement` | Achievement unlocked with XP |
| `session:revoked` | `user:{userId}` | `{ sessionId: string }` | Remote session logout |

---

## Client to Server Events

| Event | Acknowledgement Payload | Description |
|---|---|---|
| `channel:join` | `{ success: boolean, channelId: string }` | Join chat channel room |
| `channel:leave`| `{ success: boolean }` | Leave chat channel room |
| `chat:send` | `{ success: boolean, message: ChatMessage }` | Send message to channel with `clientMsgId` |
| `chat:typing` | none | Broadcast typing status |
| `whisper:typing`| none | Broadcast direct message typing status |
| `presence:activity`| none | Report active client context (`in_boss`, `in_study`, `in_quest`) |
| `study:join` | `{ success: boolean, room: StudyRoom }` | Join study chamber room |
| `study:leave` | `{ success: boolean }` | Leave study chamber room |
| `timer:sync` | `{ serverNow: number, offsetMs: number }` | Clock offset measurement for accurate countdown |
| `notes:update` | none | Relay Yjs collaborative delta |
| `whiteboard:stroke`| none | Relay batched drawing strokes |
| `boss:subscribe`| `{ success: boolean, boss: BossEncounter }` | Subscribe to live boss arena |
| `sync:resume` | `{ missedMessages: ChatMessage[], missedWhispers: any[], missedNotifications: any[] }` | Reconnection recovery backfill |
