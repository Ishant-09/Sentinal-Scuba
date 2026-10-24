import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ForbiddenError } from '../../lib/errors.js';
import { emitToStudyRoom, emitToGuild, emitToUser, broadcastAll } from '../../realtime/emitters.js';
import { xpService } from '../xp/xp.service.js';
import { env } from '../../config/env.js';

export class StudyRoomService {
  async getRooms(userId: string) {
    const membership = await prisma.guildMember.findFirst({ where: { userId } });
    const guildId = membership?.guildId || 'shadow-protocol';

    const rooms = await prisma.studyRoom.findMany({
      where: { guildId, isLive: true },
      include: {
        participants: {
          where: { leftAt: null },
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return rooms.map((r) => {
      const activeMembers = r.participants.map((p) => ({
        name: p.user.name,
        avatarSeed: p.user.avatarSeed,
        avatarColor: p.user.avatarColor
      }));

      return {
        id: r.id,
        name: r.name,
        onlineCount: activeMembers.length,
        maxCapacity: r.maxCapacity,
        topic: r.topic,
        initialTimeSeconds: 1500,
        activeMembers,
        isLive: r.isLive,
        isScreenSharing: r.participants.some((p) => p.isScreenSharing)
      };
    });
  }

  async getRoomById(roomId: string, userId: string) {
    const r = await prisma.studyRoom.findUnique({
      where: { id: roomId },
      include: {
        participants: {
          where: { leftAt: null },
          include: { user: true }
        }
      }
    });

    if (!r) throw new NotFoundError('Study room not found');

    const activeMembers = r.participants.map((p) => ({
      name: p.user.name,
      avatarSeed: p.user.avatarSeed,
      avatarColor: p.user.avatarColor
    }));

    return {
      id: r.id,
      name: r.name,
      onlineCount: activeMembers.length,
      maxCapacity: r.maxCapacity,
      topic: r.topic,
      initialTimeSeconds: 1500,
      activeMembers,
      isLive: r.isLive,
      timerState: r.timerState,
      notesSnapshot: r.notesSnapshot,
      ownerId: r.ownerId
    };
  }

  async createRoom(userId: string, input: {
    id?: string;
    name: string;
    topic: string;
    maxCapacity?: number;
    initialTimeSeconds?: number;
    invitedMembers?: string[];
    inviterName?: string;
  }) {
    const membership = await prisma.guildMember.findFirst({ where: { userId } });
    const guildId = membership?.guildId || 'shadow-protocol';

    const initialSecs = input.initialTimeSeconds || 1500;
    const room = await prisma.studyRoom.create({
      data: {
        id: input.id,
        guildId,
        name: input.name,
        topic: input.topic,
        maxCapacity: input.maxCapacity || 12,
        ownerId: userId,
        timerState: {
          mode: 'FOCUS',
          startedAt: null,
          durationMs: initialSecs * 1000,
          pausedRemainingMs: initialSecs * 1000,
          cycle: 1,
          paused: true
        }
      }
    });

    const roomPayload = {
      id: room.id,
      name: room.name,
      topic: room.topic,
      onlineCount: 1,
      maxCapacity: room.maxCapacity,
      initialTimeSeconds: initialSecs,
      activeMembers: [{ name: input.inviterName || 'Scholar', avatarSeed: 'ishant', avatarColor: '#14b8a6' }],
      isLive: true,
      tag: 'Custom',
      description: `Collaborative focus chamber dedicated to ${input.topic}.`,
      timerState: room.timerState
    };

    emitToGuild(guildId, 'study:room', {
      action: 'created',
      room: roomPayload
    });

    broadcastAll('study:room', {
      action: 'created',
      room: roomPayload
    });

    // Broadcast instant invitations
    if (Array.isArray(input.invitedMembers) && input.invitedMembers.length > 0) {
      for (const friendName of input.invitedMembers) {
        const notif = {
          id: `notif-invite-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'study',
          title: 'Study Sanctuary Invite',
          desc: `${input.inviterName || 'A scholar'} invited you to join "${input.name}" (${input.topic})!`,
          timestamp: 'Just now',
          unread: true,
          actionUrl: `?room=${room.id}`,
          roomId: room.id,
          roomName: input.name
        };
        broadcastAll('notification:new', notif);
      }
    }

    return roomPayload;
  }

  async joinRoom(userId: string, roomId: string) {
    const room = await prisma.studyRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundError('Study room not found');

    // Record participant
    await prisma.studyParticipant.create({
      data: {
        roomId,
        userId,
        isVoiceConnected: true
      }
    });

    // Fetch updated participants
    const active = await prisma.studyParticipant.findMany({
      where: { roomId, leftAt: null },
      include: { user: true }
    });

    const activeMembers = active.map((p) => ({
      name: p.user.name,
      avatarSeed: p.user.avatarSeed,
      avatarColor: p.user.avatarColor
    }));

    emitToStudyRoom(roomId, 'study:participants', {
      participants: activeMembers,
      onlineCount: activeMembers.length
    });

    emitToGuild(room.guildId, 'study:room', {
      action: 'updated',
      room: {
        id: room.id,
        name: room.name,
        onlineCount: activeMembers.length,
        maxCapacity: room.maxCapacity,
        topic: room.topic,
        activeMembers,
        isLive: room.isLive
      }
    });

    return { success: true, room };
  }

  async leaveRoom(userId: string, roomId: string) {
    await prisma.studyParticipant.updateMany({
      where: { roomId, userId, leftAt: null },
      data: { leftAt: new Date() }
    });

    const room = await prisma.studyRoom.findUnique({ where: { id: roomId } });
    if (!room) return { success: true };

    const active = await prisma.studyParticipant.findMany({
      where: { roomId, leftAt: null },
      include: { user: true }
    });

    const activeMembers = active.map((p) => ({
      name: p.user.name,
      avatarSeed: p.user.avatarSeed,
      avatarColor: p.user.avatarColor
    }));

    emitToStudyRoom(roomId, 'study:participants', {
      participants: activeMembers,
      onlineCount: activeMembers.length
    });

    return { success: true };
  }

  async endRoom(userId: string, roomId: string) {
    const room = await prisma.studyRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundError('Study room not found');

    // Only chamber owner can end chamber
    if (room.ownerId !== userId) {
      throw new ForbiddenError('Only the chamber host can end the chamber session');
    }

    await prisma.studyRoom.update({
      where: { id: roomId },
      data: { isLive: false, endedAt: new Date() }
    });

    // Evict all participants
    await prisma.studyParticipant.updateMany({
      where: { roomId, leftAt: null },
      data: { leftAt: new Date() }
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Broadcast chamber ended to all clients inside the chamber and guild
    emitToStudyRoom(roomId, 'study:ended', {
      roomId,
      endedBy: user?.name || 'Host'
    });

    emitToGuild(room.guildId, 'study:room', {
      action: 'ended',
      room: { id: roomId, isLive: false }
    });

    return { success: true };
  }

  async getTimer(roomId: string) {
    const room = await prisma.studyRoom.findUnique({ where: { id: roomId } });
    if (!room) return null;
    return {
      roomId,
      ...((room.timerState as any) || {
        mode: 'FOCUS',
        startedAt: null,
        durationMs: 1500000,
        pausedRemainingMs: 1500000,
        cycle: 1,
        paused: true
      }),
      serverNow: Date.now()
    };
  }

  async updateTimer(userId: string, roomId: string, action: 'start' | 'pause' | 'resume' | 'reset' | 'skip' | 'setMode', durationMinutes?: number) {
    let room = await prisma.studyRoom.findUnique({ where: { id: roomId } });
    if (!room) {
      const allRooms = await prisma.studyRoom.findMany({ take: 1 });
      if (allRooms.length > 0) {
        room = allRooms[0];
        roomId = room.id;
      } else {
        throw new NotFoundError('Study room not found');
      }
    }

    let timerState = (room.timerState as any) || {
      mode: 'FOCUS',
      startedAt: null,
      durationMs: 1500000,
      pausedRemainingMs: 1500000,
      cycle: 1,
      paused: true
    };

    const now = Date.now();

    if (action === 'start' || action === 'resume') {
      if (timerState.pausedRemainingMs <= 0) {
        timerState.pausedRemainingMs = timerState.durationMs || 1500000;
      }
      timerState.startedAt = now;
      timerState.paused = false;
    } else if (action === 'pause') {
      if (timerState.startedAt) {
        const elapsed = now - timerState.startedAt;
        timerState.pausedRemainingMs = Math.max(0, timerState.pausedRemainingMs - elapsed);
      }
      timerState.startedAt = null;
      timerState.paused = true;
    } else if (action === 'reset') {
      const modeMs = durationMinutes ? durationMinutes * 60 * 1000 : (timerState.durationMs || 1500000);
      timerState.durationMs = modeMs;
      timerState.pausedRemainingMs = modeMs;
      timerState.startedAt = null;
      timerState.paused = true;
    } else if (action === 'setMode') {
      const mins = durationMinutes || 25;
      const modeMs = mins * 60 * 1000;
      timerState.durationMs = modeMs;
      timerState.pausedRemainingMs = modeMs;
      timerState.startedAt = null;
      timerState.paused = true;
      timerState.mode = mins === 15 ? 'BREAK' : 'FOCUS';
    } else if (action === 'skip') {
      const nextMode = timerState.mode === 'FOCUS' ? 'BREAK' : 'FOCUS';
      const durationMs = nextMode === 'FOCUS' ? 1500000 : 300000;
      timerState = {
        mode: nextMode,
        startedAt: now,
        durationMs,
        pausedRemainingMs: durationMs,
        paused: false,
        cycle: (timerState.cycle || 1) + 1
      };

      // If finished focus block, record study minutes
      if (timerState.mode === 'BREAK') {
        try {
          await prisma.studySession.create({
            data: {
              userId,
              roomId,
              minutes: 25
            }
          });

          await xpService.grantXp({
            userId,
            source: 'STUDY_TIME',
            sourceRef: `session-${Date.now()}`,
            amount: 60,
            label: 'Completed 25m Focus Block'
          });
        } catch {}
      }
    }

    await prisma.studyRoom.update({
      where: { id: roomId },
      data: { timerState }
    });

    const payload = {
      roomId,
      ...timerState,
      serverNow: now
    };

    emitToStudyRoom(roomId, 'study:timer', payload);
    broadcastAll('study:timer', payload);

    return timerState;
  }

  async getWhiteboard(roomId: string) {
    const strokes = await prisma.whiteboardStroke.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' }
    });

    return strokes.map((s) => s.data);
  }

  async submitMinigameScore(userId: string, roomId: string, game: string, score: number) {
    const entry = await prisma.minigameScore.create({
      data: {
        userId,
        roomId: roomId || null,
        game,
        score
      }
    });

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    await xpService.grantXp({
      userId,
      source: 'MINIGAME',
      sourceRef: `score-${entry.id}`,
      amount: Math.min(score, 100),
      label: `Break Game Score in ${game}`
    });

    if (roomId) {
      emitToStudyRoom(roomId, 'minigame:score', {
        userId,
        userName: user.name,
        game,
        score
      });
    }

    return entry;
  }
}

export const studyRoomService = new StudyRoomService();
