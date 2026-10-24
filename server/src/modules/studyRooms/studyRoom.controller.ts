import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { studyRoomService } from './studyRoom.service.js';
import { optionalAuth } from '../auth/auth.middleware.js';
import { AccessToken } from 'livekit-server-sdk';
import { env } from '../../config/env.js';
import { prisma } from '../../lib/prisma.js';
import { broadcastAll } from '../../realtime/emitters.js';

export const studyRoomRouter = Router();

studyRoomRouter.use(optionalAuth);

const createRoomSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(100),
  topic: z.string().min(2).max(150),
  maxCapacity: z.number().int().min(2).max(30).optional(),
  initialTimeSeconds: z.number().int().optional(),
  invitedMembers: z.array(z.string()).optional(),
  inviterName: z.string().optional()
});

studyRoomRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || 'usr-ishant-1';
    const rooms = await studyRoomService.getRooms(userId);
    res.json({ rooms });
  } catch (err) {
    next(err);
  }
});

studyRoomRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createRoomSchema.parse(req.body);
    const userId = req.user?.id || 'usr-ishant-1';
    const room = await studyRoomService.createRoom(userId, body);
    res.status(201).json({ room });
  } catch (err) {
    next(err);
  }
});

studyRoomRouter.post('/:id/invite', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { friends, inviterName } = req.body;
    const room = await prisma.studyRoom.findUnique({ where: { id: req.params.id } });
    const roomName = room?.name || 'Study Chamber';
    const roomTopic = room?.topic || 'Curriculum Focus';

    if (Array.isArray(friends) && friends.length > 0) {
      for (const friend of friends) {
        const notif = {
          id: `notif-invite-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'study',
          title: 'Study Sanctuary Invite',
          desc: `${inviterName || 'A scholar'} invited you to join "${roomName}" (${roomTopic})!`,
          timestamp: 'Just now',
          unread: true,
          actionUrl: `?room=${req.params.id}`,
          roomId: req.params.id,
          roomName: roomName
        };
        broadcastAll('notification:new', notif);
      }
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

studyRoomRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const room = await studyRoomService.getRoomById(req.params.id, req.user!.id);
    res.json({ room });
  } catch (err) {
    next(err);
  }
});

studyRoomRouter.post('/:id/join', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await studyRoomService.joinRoom(req.user!.id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

studyRoomRouter.post('/:id/leave', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await studyRoomService.leaveRoom(req.user!.id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

studyRoomRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await studyRoomService.endRoom(req.user!.id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

studyRoomRouter.get('/:id/timer', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timerState = await studyRoomService.getTimer(req.params.id);
    res.json({ timerState });
  } catch (err) {
    next(err);
  }
});

studyRoomRouter.post('/:id/timer', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = z.object({
      action: z.enum(['start', 'pause', 'resume', 'reset', 'skip', 'setMode']),
      durationMinutes: z.number().optional()
    }).parse(req.body);
    const userId = req.user?.id || 'usr-ishant-1';
    const timerState = await studyRoomService.updateTimer(userId, req.params.id, body.action, body.durationMinutes);
    res.json({ timerState });
  } catch (err) {
    next(err);
  }
});

studyRoomRouter.get('/:id/whiteboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const strokes = await studyRoomService.getWhiteboard(req.params.id);
    res.json({ strokes });
  } catch (err) {
    next(err);
  }
});

studyRoomRouter.post('/:id/livekit-token', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = env.LIVEKIT_API_KEY || 'devkey';
    const apiSecret = env.LIVEKIT_API_SECRET || 'secret';
    const identity = req.user!.id;
    const roomName = req.params.id;

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      ttl: '2h'
    });
    at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });
    const token = await at.toJwt();

    res.json({ token, livekitUrl: env.LIVEKIT_URL });
  } catch (err) {
    next(err);
  }
});

studyRoomRouter.post('/:id/minigames/:game/score', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = z.object({ score: z.number().int().min(0) }).parse(req.body);
    const score = await studyRoomService.submitMinigameScore(req.user!.id, req.params.id, req.params.game, body.score);
    res.json({ score });
  } catch (err) {
    next(err);
  }
});
