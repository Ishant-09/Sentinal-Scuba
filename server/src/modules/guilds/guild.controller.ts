import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { guildService } from './guild.service.js';
import { requireAuth } from '../auth/auth.middleware.js';

export const guildRouter = Router();

guildRouter.use(requireAuth);

const createGuildSchema = z.object({
  name: z.string().min(3).max(50),
  tag: z.string().min(2).max(5),
  description: z.string().max(200),
  emblemIcon: z.string().optional(),
  emblemColor: z.string().optional()
});

guildRouter.get('/mine', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guilds = await guildService.getMyGuilds(req.user!.id);
    res.json({ guilds });
  } catch (err) {
    next(err);
  }
});

guildRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createGuildSchema.parse(req.body);
    const guild = await guildService.createGuild(req.user!.id, body);
    res.status(201).json({ guild });
  } catch (err) {
    next(err);
  }
});

guildRouter.post('/join', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = z.object({ inviteCode: z.string().min(4) }).parse(req.body);
    const guild = await guildService.joinGuild(req.user!.id, body.inviteCode);
    res.json({ guild });
  } catch (err) {
    next(err);
  }
});

guildRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guild = await guildService.getGuildById(req.params.id, req.user!.id);
    res.json({ guild });
  } catch (err) {
    next(err);
  }
});

guildRouter.get('/:id/members', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await guildService.getGuildMembers(req.params.id);
    res.json({ members });
  } catch (err) {
    next(err);
  }
});

guildRouter.post('/:id/invite-code/rotate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await guildService.rotateInviteCode(req.params.id, req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

guildRouter.get('/:id/activity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activities = await guildService.getGuildActivity(req.params.id);
    res.json({ activities });
  } catch (err) {
    next(err);
  }
});
