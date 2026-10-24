import { Router, Request, Response, NextFunction } from 'express';
import { leaderboardService } from './leaderboard.service.js';
import { requireAuth } from '../auth/auth.middleware.js';

export const leaderboardRouter = Router();

leaderboardRouter.use(requireAuth);

leaderboardRouter.get('/weekly', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guildId = (req.query.guildId as string) || 'shadow-protocol';
    const leaderboard = await leaderboardService.getWeeklyLeaderboard(guildId, req.user!.id);
    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
});
