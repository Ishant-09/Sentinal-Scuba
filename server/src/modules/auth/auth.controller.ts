import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from './auth.service.js';
import { requireAuth } from './auth.middleware.js';
import { env } from '../../config/env.js';

export const authRouter = Router();

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(50),
  handle: z.string().min(2).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  roleClass: z.string().optional(),
  avatarSeed: z.string().optional(),
  avatarColor: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  deviceLabel: z.string().optional()
});

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
};

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = registerSchema.parse(req.body);
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;

    const result = await authService.register({
      ...body,
      userAgent,
      ip
    });

    res.cookie('refreshToken', result.refreshToken, cookieOptions);
    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = loginSchema.parse(req.body);
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;

    const result = await authService.login({
      ...body,
      userAgent,
      ip
    });

    res.cookie('refreshToken', result.refreshToken, cookieOptions);
    res.json({
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/username-login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;

    const result = await authService.usernameLogin({
      username: username || 'Scholar',
      userAgent,
      ip
    });

    res.cookie('refreshToken', result.refreshToken, cookieOptions);
    res.json({
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;

    const result = await authService.refresh(rawRefreshToken, userAgent, ip);

    res.cookie('refreshToken', result.refreshToken, cookieOptions);
    res.json({
      accessToken: result.accessToken
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    await authService.logout(rawRefreshToken);
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/logout-all', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.logoutAll(req.user!.id);
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ success: true, message: 'All active sessions revoked' });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/sessions', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await authService.getSessions(req.user!.id);
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
});

authRouter.delete('/sessions/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.revokeSession(req.user!.id, req.params.id);
    res.json({ success: true, message: 'Session revoked' });
  } catch (err) {
    next(err);
  }
});
