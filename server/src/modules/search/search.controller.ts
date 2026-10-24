import { Router, Request, Response, NextFunction } from 'express';
import { searchService } from './search.service.js';
import { optionalAuth } from '../auth/auth.middleware.js';

export const searchRouter = Router();

searchRouter.use(optionalAuth);

searchRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) || '';
    const type = req.query.type as string | undefined;
    const items = await searchService.search(q, type);
    res.json({ items });
  } catch (err) {
    next(err);
  }
});
