import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { whisperService } from './whisper.service.js';
import { requireAuth } from '../auth/auth.middleware.js';

export const whisperRouter = Router();

whisRouterAuth();

function whisRouterAuth() {
  whisperRouter.use(requireAuth);
}

const sendWhisperSchema = z.object({
  text: z.string().min(1).max(2000),
  clientMsgId: z.string().optional()
});

whisperRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversations = await whisperService.getConversations(req.user!.id);
    res.json({ conversations });
  } catch (err) {
    next(err);
  }
});

whisperRouter.get('/:memberId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const before = req.query.before as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const messages = await whisperService.getMessages(req.user!.id, req.params.memberId, before, limit);
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

whisperRouter.post('/:memberId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = sendWhisperSchema.parse(req.body);
    const message = await whisperService.sendWhisper(req.user!.id, req.params.memberId, body);
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
});

whisperRouter.post('/:memberId/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await whisperService.markAsRead(req.user!.id, req.params.memberId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
