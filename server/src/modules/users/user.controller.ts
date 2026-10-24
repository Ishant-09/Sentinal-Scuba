import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { userService } from './user.service.js';
import { requireAuth } from '../auth/auth.middleware.js';

export const userRouter = Router();

userRouter.use(requireAuth);

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  roleClass: z.string().max(40).optional(),
  avatarSeed: z.string().max(50).optional(),
  avatarColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  bio: z.string().max(200).optional()
});

const updateSettingsSchema = z.object({
  theme: z.enum(['DARK', 'LIGHT']).optional(),
  soundEnabled: z.boolean().optional(),
  volume: z.number().min(0).max(100).optional(),
  chimeEnabled: z.boolean().optional(),
  weeklyGoalMinutes: z.number().min(60).max(10000).optional(),
  recentSearches: z.array(z.string()).optional(),
  notificationPrefs: z.record(z.any()).optional()
});

userRouter.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await userService.getMe(req.user!.id);
    res.json({ user: profile });
  } catch (err) {
    next(err);
  }
});

userRouter.patch('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = updateProfileSchema.parse(req.body);
    const updated = await userService.updateMe(req.user!.id, body);
    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

userRouter.patch('/me/settings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = updateSettingsSchema.parse(req.body);
    const updated = await userService.updateSettings(req.user!.id, body);
    res.json({ settings: updated });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/me/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await userService.getUserStats(req.user!.id);
    res.json({ stats });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await userService.getPublicProfile(req.params.id);
    res.json({ user: profile });
  } catch (err) {
    next(err);
  }
});
