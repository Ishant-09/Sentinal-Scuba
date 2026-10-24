import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { chatService } from './chat.service.js';
import { optionalAuth } from '../auth/auth.middleware.js';

export const chatRouter = Router();

chatRouter.use(optionalAuth);

const sendMessageSchema = z.object({
  text: z.string().max(4000).default(''),
  codeSnippet: z.string().max(20000).optional(),
  codeLanguage: z.string().optional(),
  clientMsgId: z.string().optional(),
  senderName: z.string().optional(),
  senderAvatar: z.string().optional(),
  senderRole: z.string().optional()
});

chatRouter.get('/channels', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || 'usr-ishant-1';
    const channels = await chatService.getChannels(userId);
    res.json({ channels });
  } catch (err) {
    next(err);
  }
});

chatRouter.get('/:channelId/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const before = req.query.before as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const messages = await chatService.getMessages(req.params.channelId, before, limit);
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

chatRouter.post('/:channelId/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = sendMessageSchema.parse(req.body);
    const userId = req.user?.id || 'usr-ishant-1';
    const message = await chatService.sendMessage(userId, req.params.channelId, body);
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
});

chatRouter.post('/messages/:id/reactions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = z.object({ emoji: z.string().min(1) }).parse(req.body);
    const userId = req.user?.id || 'usr-ishant-1';
    const reactions = await chatService.toggleReaction(userId, req.params.id, body.emoji);
    res.json({ reactions });
  } catch (err) {
    next(err);
  }
});
