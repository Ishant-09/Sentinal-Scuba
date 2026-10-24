import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { UnauthorizedError } from '../../lib/errors.js';

export interface AuthUser {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed Authorization header');
  }

  const token = authHeader.substring(7).trim();
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    req.user = { id: payload.userId };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access token expired', 'TOKEN_EXPIRED');
    }
    throw new UnauthorizedError('Invalid access token');
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      req.user = { id: payload.userId };
    } catch {
      // ignore
    }
  }
  next();
}
