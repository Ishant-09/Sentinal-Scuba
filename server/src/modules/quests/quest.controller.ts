import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { questService } from './quest.service.js';
import { requireAuth } from '../auth/auth.middleware.js';

export const questRouter = Router();

questRouter.use(requireAuth);

questRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const track = req.query.track as string | undefined;
    const quests = await questService.getQuests(req.user!.id, track);
    res.json({ quests });
  } catch (err) {
    next(err);
  }
});

questRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quest = await questService.getQuestById(req.params.id, req.user!.id);
    res.json({ quest });
  } catch (err) {
    next(err);
  }
});

questRouter.post('/:id/start', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await questService.startQuest(req.user!.id, req.params.id);
    res.json({ progress });
  } catch (err) {
    next(err);
  }
});

questRouter.post('/:id/steps/:stepIndex/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stepIndex = parseInt(req.params.stepIndex, 10);
    const result = await questService.completeStep(req.user!.id, req.params.id, stepIndex);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

questRouter.post('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await questService.completeQuest(req.user!.id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

questRouter.get('/:id/challenge', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const challenge = await questService.getHintChallenge(req.params.id);
    res.json({ challenge });
  } catch (err) {
    next(err);
  }
});

questRouter.post('/challenges/:id/attempt', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = z.object({ selectedIndex: z.number().int() }).parse(req.body);
    const result = await questService.attemptChallenge(req.user!.id, req.params.id, body.selectedIndex);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
