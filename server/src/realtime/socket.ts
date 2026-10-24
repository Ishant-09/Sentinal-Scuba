import { Server, Socket } from 'socket.io';
import type { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { createAdapter } from '@socket.io/redis-adapter';
import { env } from '../config/env.js';
import { redis } from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';
import { setIoInstance } from './emitters.js';
import { chatService } from '../modules/chat/chat.service.js';
import { studyRoomService } from '../modules/studyRooms/studyRoom.service.js';
import { bossService } from '../modules/boss/boss.service.js';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  guildId?: string;
}

const roomWhiteboardHistory = new Map<string, any[]>();
const roomStickyNotes = new Map<string, any[]>();

export function initSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  setIoInstance(io);

  // Handshake Authentication (Allows authenticated scholars and guests)
  io.use(async (socket: AuthenticatedSocket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      socket.userId = `guest-${socket.id.slice(0, 8)}`;
      socket.guildId = 'shadow-protocol';
      return next();
    }

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      socket.userId = payload.userId;

      // Lookup user's guild
      const member = await prisma.guildMember.findFirst({
        where: { userId: payload.userId }
      });
      socket.guildId = member?.guildId || 'shadow-protocol';

      next();
    } catch {
      socket.userId = `guest-${socket.id.slice(0, 8)}`;
      socket.guildId = 'shadow-protocol';
      next();
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    const guildId = socket.guildId || 'shadow-protocol';

    // 1. Auto-join user, guild, and all common chat channels
    socket.join(`user:${userId}`);
    socket.join(`guild:${guildId}`);
    socket.join('channel:sql-joins');
    socket.join('channel:general-study');
    socket.join('channel:boss-tactics');
    socket.join('channel:code-review');
    socket.join('channel:general');
    socket.join('study:study-sanctuary');
    socket.join('study:python-algorithms');
    socket.join('study:systems-architecture');
    socket.join('study:maths-foundations');
    socket.join('study:room-sql-sanctuary');
    socket.join('study:room-py-algorithms');
    socket.join('study:room-focus-sanctum');

    logger.info({ userId, socketId: socket.id }, 'Socket connected and joined core rooms');

    // 2. Track Presence in Redis
    const presenceKey = `presence:${userId}`;
    try {
      await redis.sadd(presenceKey, socket.id);
      await redis.expire(presenceKey, 60);
    } catch (e: any) {
      logger.warn({ err: e?.message }, 'Failed to write socket presence to redis');
    }

    // Broadcast ONLINE presence
    io.to(`guild:${guildId}`).emit('presence:update', {
      userId,
      status: 'Online',
      isOnline: true
    });

    // 3. Heartbeat listener
    socket.on('presence:activity', async (data: { status?: string }) => {
      try {
        await redis.expire(presenceKey, 60);
      } catch {}
      if (data?.status) {
        io.to(`guild:${guildId}`).emit('presence:update', {
          userId,
          status: data.status,
          isOnline: true
        });
      }
    });

    // 4. Channel Membership & Messaging
    socket.on('channel:join', (data: { channelId: string }, cb) => {
      socket.join(`channel:${data.channelId}`);
      if (typeof cb === 'function') cb({ success: true, channelId: data.channelId });
    });

    socket.on('channel:leave', (data: { channelId: string }, cb) => {
      socket.leave(`channel:${data.channelId}`);
      if (typeof cb === 'function') cb({ success: true });
    });

    socket.on('chat:message', (data: any) => {
      socket.broadcast.emit('chat:message', data);
    });

    socket.on('chat:send', async (data: { channelId: string; text: string; codeSnippet?: string; clientMsgId?: string }, cb) => {
      try {
        const msg = await chatService.sendMessage(userId, data.channelId, {
          text: data.text,
          codeSnippet: data.codeSnippet,
          clientMsgId: data.clientMsgId
        });
        if (typeof cb === 'function') cb({ success: true, message: msg });
      } catch (err: any) {
        if (typeof cb === 'function') cb({ success: false, error: err.message });
      }
    });

    socket.on('chat:typing', (data: { channelId: string; isTyping: boolean }) => {
      socket.to(`channel:${data.channelId}`).emit('chat:typing', {
        userId,
        isTyping: data.isTyping
      });
    });

    socket.on('whisper:typing', (data: { recipientId: string; isTyping: boolean }) => {
      io.to(`user:${data.recipientId}`).emit('whisper:typing', {
        memberId: userId,
        isTyping: data.isTyping
      });
    });

    // 5. Study Chambers & Timer Sync
    socket.on('study:join', async (data: { roomId: string }, cb) => {
      socket.join(`study:${data.roomId}`);
      await studyRoomService.joinRoom(userId, data.roomId);
      if (typeof cb === 'function') cb({ success: true });
    });

    socket.on('study:leave', async (data: { roomId: string }, cb) => {
      socket.leave(`study:${data.roomId}`);
      await studyRoomService.leaveRoom(userId, data.roomId);
      if (typeof cb === 'function') cb({ success: true });
    });

    // Clock offset measurement for accurate millisecond countdown without per-second ticks
    socket.on('timer:sync', (clientTimestamp: number, cb) => {
      const serverNow = Date.now();
      const offsetMs = serverNow - clientTimestamp;
      if (typeof cb === 'function') {
        cb({ serverNow, offsetMs });
      }
    });

    socket.on('study:timer', async (data: any, cb) => {
      const roomId = data?.roomId || 'room-sql-sanctuary';
      const action = data?.action || 'start';
      const durationMinutes = data?.durationMinutes;
      try {
        const timerState = await studyRoomService.updateTimer(userId, roomId, action, durationMinutes);
        if (typeof cb === 'function') cb({ success: true, timerState });
      } catch (err: any) {
        if (typeof cb === 'function') cb({ success: false, error: err?.message });
      }
    });

    socket.on('study:get_timer', async (data: any, cb) => {
      const roomId = data?.roomId || 'room-sql-sanctuary';
      try {
        const timerState = await studyRoomService.getTimer(roomId);
        if (typeof cb === 'function') cb({ success: true, timerState });
      } catch (err: any) {
        if (typeof cb === 'function') cb({ success: false, error: err?.message });
      }
    });

    socket.on('study:room', (data: any) => {
      io.emit('study:room', data);
    });

    socket.on('notification:send', (notif: any) => {
      io.emit('notification:new', notif);
    });

    socket.on('notes:update', (data: { roomId: string; delta: string }) => {
      socket.to(`study:${data.roomId}`).emit('study:notes', { update: data.delta });
    });

    socket.on('whiteboard:init', (data: { roomId?: string }, cb) => {
      const roomId = data?.roomId || 'study-sanctuary';
      socket.join(`study:${roomId}`);
      const history = roomWhiteboardHistory.get(roomId) || [];
      const stickyNotes = roomStickyNotes.get(roomId);
      if (typeof cb === 'function') {
        cb({ history, stickyNotes });
      }
    });

    socket.on('whiteboard:draw', (data: { roomId: string; event: any }) => {
      if (!data?.event) return;
      const roomId = data.roomId || 'study-sanctuary';
      if (!roomWhiteboardHistory.has(roomId)) {
        roomWhiteboardHistory.set(roomId, []);
      }
      const history = roomWhiteboardHistory.get(roomId)!;
      history.push(data.event);
      if (history.length > 3000) history.shift();

      socket.to(`study:${roomId}`).emit('whiteboard:draw', data);
      socket.broadcast.emit('whiteboard:draw', data);
      socket.to(`study:${roomId}`).emit('study:strokes', { strokes: [data.event] });
    });

    socket.on('whiteboard:stroke', (data: { roomId: string; stroke: any }) => {
      if (!data?.stroke) return;
      const roomId = data.roomId || 'study-sanctuary';
      if (!roomWhiteboardHistory.has(roomId)) {
        roomWhiteboardHistory.set(roomId, []);
      }
      const history = roomWhiteboardHistory.get(roomId)!;
      history.push(data.stroke);
      if (history.length > 3000) history.shift();

      socket.to(`study:${roomId}`).emit('whiteboard:draw', { roomId, event: data.stroke });
      socket.broadcast.emit('whiteboard:draw', { roomId, event: data.stroke });
      socket.to(`study:${roomId}`).emit('study:strokes', { strokes: [data.stroke] });
    });

    socket.on('whiteboard:clear', (data: { roomId: string; userName?: string }) => {
      const roomId = data?.roomId || 'study-sanctuary';
      roomWhiteboardHistory.set(roomId, []);
      socket.to(`study:${roomId}`).emit('whiteboard:clear', data);
      socket.broadcast.emit('whiteboard:clear', data);
    });

    socket.on('whiteboard:sticky', (data: { roomId: string; notes: any[] }) => {
      const roomId = data?.roomId || 'study-sanctuary';
      if (data?.notes) {
        roomStickyNotes.set(roomId, data.notes);
      }
      socket.to(`study:${roomId}`).emit('whiteboard:sticky', data);
      socket.broadcast.emit('whiteboard:sticky', data);
    });

    // 6. Boss Arena
    socket.on('boss:subscribe', async (data: { bossId: string }, cb) => {
      socket.join(`boss:${data.bossId}`);
      const boss = await bossService.getCurrentBoss(userId);
      if (typeof cb === 'function') cb({ success: true, boss });
    });

    // 7. Reconnection Recovery (sync:resume)
    socket.on('sync:resume', async (data: { lastMessageId?: string; lastWhisperId?: string }, cb) => {
      try {
        const missedMessages = await chatService.getMessages('sql-joins', undefined, 50);
        if (typeof cb === 'function') {
          cb({ missedMessages: missedMessages.slice(-50), missedWhispers: [] });
        }
      } catch {
        if (typeof cb === 'function') cb({ missedMessages: [] });
      }
    });

    // Disconnect Handler
    socket.on('disconnect', async () => {
      try {
        await redis.srem(presenceKey, socket.id);
      } catch {}

      // Debounce OFFLINE broadcast by 2s so page reloads don't flap
      setTimeout(async () => {
        try {
          const stillLive = await redis.scard(presenceKey);
          if (stillLive === 0) {
            io.to(`guild:${guildId}`).emit('presence:update', {
              userId,
              status: 'Offline',
              isOnline: false
            });
          }
        } catch {}
      }, 2000);
    });
  });

  return io;
}
