import { Router, Request, Response, NextFunction } from 'express';
import { friendService } from './friend.service.js';
import { requireAuth } from '../auth/auth.middleware.js';

export const friendRouter = Router();

friendRouter.use(requireAuth);

friendRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const friends = await friendService.getFriends(req.user!.id);
    res.json({ members: friends });
  } catch (err) {
    next(err);
  }
});

friendRouter.post('/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const friendship = await friendService.sendFriendRequest(req.user!.id, req.params.userId);
    res.json({ friendship });
  } catch (err) {
    next(err);
  }
});

friendRouter.post('/:userId/accept', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const friendship = await friendService.acceptFriendRequest(req.user!.id, req.params.userId);
    res.json({ friendship });
  } catch (err) {
    next(err);
  }
});

friendRouter.delete('/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await friendService.removeFriend(req.user!.id, req.params.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
