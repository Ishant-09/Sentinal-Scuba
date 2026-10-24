import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env, allowedCorsOrigins } from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { AppError } from './lib/errors.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';
import { redis } from './lib/redis.js';

import { authRouter } from './modules/auth/auth.controller.js';
import { userRouter } from './modules/users/user.controller.js';
import { guildRouter } from './modules/guilds/guild.controller.js';
import { questRouter } from './modules/quests/quest.controller.js';
import { studyRoomRouter } from './modules/studyRooms/studyRoom.controller.js';
import { chatRouter } from './modules/chat/chat.controller.js';
import { whisperRouter } from './modules/whispers/whisper.controller.js';
import { bossRouter } from './modules/boss/boss.controller.js';
import { leaderboardRouter } from './modules/leaderboard/leaderboard.controller.js';
import { achievementRouter } from './modules/achievements/achievement.controller.js';
import { friendRouter } from './modules/friends/friend.controller.js';
import { searchRouter } from './modules/search/search.controller.js';

export const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// CORS configuration supporting multi-device Wi-Fi testing
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or local network
      if (!origin) return callback(null, true);
      if (env.NODE_ENV === 'development') {
        // In dev, permit all localhost, 127.0.0.1 and private LAN addresses (192.168.*, 10.*, 172.16.*)
        return callback(null, true);
      }
      if (allowedCorsOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Global Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests, please slow down'
    }
  }
});

// Stricter Rate Limiter for Auth & Chat Messages
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: {
      code: 'AUTH_RATE_LIMITED',
      message: 'Too many login or register attempts, please try again later'
    }
  }
});

app.use('/api/', apiLimiter);
app.use('/api/v1/auth/login', strictLimiter);
app.use('/api/v1/auth/register', strictLimiter);

// 1. System & Health Endpoints
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/api/v1/ready', async (req: Request, res: Response) => {
  let dbOk = false;
  let redisOk = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  try {
    const ping = await redis.ping();
    redisOk = ping === 'PONG';
  } catch {
    redisOk = false;
  }

  const isReady = dbOk;
  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ready' : 'unhealthy',
    database: dbOk ? 'connected' : 'disconnected',
    redis: redisOk ? 'connected' : 'in-memory-fallback',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/system/network-info', (req: Request, res: Response) => {
  let lanIp = 'localhost';
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    const list = nets[name];
    if (list) {
      for (const net of list) {
        if (net.family === 'IPv4' && !net.internal) {
          lanIp = net.address;
          break;
        }
      }
    }
  }

  const clientPort = 3000;
  res.json({
    hostIp: lanIp,
    port: env.PORT,
    clientPort,
    networkUrl: `http://${lanIp}:${clientPort}/?tab=study_chat`,
    connectedCount: 1
  });
});

// 2. Mount REST API Modules
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/guilds', guildRouter);
app.use('/api/v1/quests', questRouter);
app.use('/api/v1/study-rooms', studyRoomRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/whispers', whisperRouter);
app.use('/api/v1/boss', bossRouter);
app.use('/api/v1/leaderboard', leaderboardRouter);
app.use('/api/v1/achievements', achievementRouter);
app.use('/api/v1/friends', friendRouter);
app.use('/api/v1/search', searchRouter);

// 3. Serve Frontend Production Build & SPA Fallback
const clientDistPath = path.resolve(__dirname, '../../dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// 4. 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`
    }
  });
});

// 4. Centralized Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        details: err.format ? err.format() : err.errors
      }
    });
  }

  logger.error({ err, path: req.path }, 'Unhandled server error');

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    }
  });
});
