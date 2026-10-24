import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { bossService } from './boss.service.js';
import { requireAuth } from '../auth/auth.middleware.js';

export const bossRouter = Router();

bossRouter.use(requireAuth);

bossRouter.get('/current', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boss = await bossService.getCurrentBoss(req.user!.id);
    res.json({ boss });
  } catch (err) {
    next(err);
  }
});

bossRouter.post('/attack', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = z.object({ abilityName: z.string().min(1) }).parse(req.body);
    const result = await bossService.attackBoss(req.user!.id, body.abilityName);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

bossRouter.get('/logs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await bossService.getRaidLogs();
    res.json({ logs });
  } catch (err) {
    next(err);
  }
});
