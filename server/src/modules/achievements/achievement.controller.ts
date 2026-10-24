import { Router, Request, Response, NextFunction } from 'express';
import { achievementService } from './achievement.service.js';
import { requireAuth } from '../auth/auth.middleware.js';

export const achievementRouter = Router();

achievementRouter.use(requireAuth);

achievementRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const achievements = await achievementService.getAchievements(req.user!.id);
    res.json({ achievements });
  } catch (err) {
    next(err);
  }
});

achievementRouter.get('/notifications', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await achievementService.getNotifications(req.user!.id);
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
});

achievementRouter.post('/notifications/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await achievementService.markNotificationAsRead(req.user!.id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

achievementRouter.post('/notifications/read-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await achievementService.markAllNotificationsAsRead(req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
