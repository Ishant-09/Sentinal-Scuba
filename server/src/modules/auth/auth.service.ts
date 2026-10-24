import crypto from 'crypto';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from '../../lib/errors.js';
import { emitToUser, emitToGuild } from '../../realtime/emitters.js';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export function generateAccessToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshTokenString(): string {
  return crypto.randomBytes(40).toString('hex');
}

export class AuthService {
  async register(input: {
    email: string;
    password: string;
    name: string;
    handle: string;
    roleClass?: string;
    avatarSeed?: string;
    avatarColor?: string;
    userAgent?: string;
    ip?: string;
  }) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email.toLowerCase().trim() }, { handle: input.handle.toLowerCase().trim() }]
      }
    });

    if (existing) {
      if (existing.email === input.email.toLowerCase().trim()) {
        throw new ConflictError('Email already registered', 'EMAIL_TAKEN');
      }
      throw new ConflictError('Adventurer handle already taken', 'HANDLE_TAKEN');
    }

    const passwordHash = await argon2.hash(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase().trim(),
        handle: input.handle.toLowerCase().trim(),
        name: input.name.trim(),
        passwordHash,
        roleClass: input.roleClass || 'Scholar',
        avatarSeed: input.avatarSeed || input.handle.toLowerCase().trim(),
        avatarColor: input.avatarColor || '#14b8a6',
        settings: {
          create: {
            theme: 'DARK',
            soundEnabled: true,
            volume: 80,
            chimeEnabled: true,
            weeklyGoalMinutes: 600,
            recentSearches: []
          }
        }
      }
    });

    // Auto-enroll into default guild Shadow Protocol if it exists
    const defaultGuild = await prisma.guild.findUnique({ where: { id: 'shadow-protocol' } });
    if (defaultGuild) {
      await prisma.guildMember.create({
        data: {
          guildId: defaultGuild.id,
          userId: user.id,
          role: 'SCHOLAR'
        }
      });
    }

    // Generate tokens
    const rawRefreshToken = generateRefreshTokenString();
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawRefreshToken),
        deviceLabel: input.userAgent ? input.userAgent.substring(0, 40) : 'Web Client',
        userAgent: input.userAgent,
        ip: input.ip,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
      }
    });

    const accessToken = generateAccessToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        handle: user.handle,
        roleClass: user.roleClass,
        level: user.level,
        currentXp: user.currentXp,
        maxXp: user.maxXp,
        dailyStreak: user.dailyStreak,
        masteryScore: user.masteryScore,
        avatarSeed: user.avatarSeed,
        avatarColor: user.avatarColor
      },
      accessToken,
      refreshToken: rawRefreshToken
    };
  }

  async login(input: {
    email: string;
    password: string;
    userAgent?: string;
    ip?: string;
    deviceLabel?: string;
  }) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isValid = await argon2.verify(user.passwordHash, input.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const rawRefreshToken = generateRefreshTokenString();
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawRefreshToken),
        deviceLabel: input.deviceLabel || (input.userAgent ? input.userAgent.substring(0, 40) : 'Web Client'),
        userAgent: input.userAgent,
        ip: input.ip,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
      }
    });

    const accessToken = generateAccessToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        handle: user.handle,
        roleClass: user.roleClass,
        level: user.level,
        currentXp: user.currentXp,
        maxXp: user.maxXp,
        dailyStreak: user.dailyStreak,
        masteryScore: user.masteryScore,
        avatarSeed: user.avatarSeed,
        avatarColor: user.avatarColor
      },
      accessToken,
      refreshToken: rawRefreshToken
    };
  }

  async refresh(rawRefreshToken: string, userAgent?: string, ip?: string) {
    if (!rawRefreshToken) {
      throw new UnauthorizedError('Refresh token required', 'REFRESH_TOKEN_REQUIRED');
    }

    const tokenHash = hashToken(rawRefreshToken);
    const stored = await prisma.refreshToken.findFirst({
      where: { tokenHash }
    });

    if (!stored) {
      throw new UnauthorizedError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }

    // Reuse detection: If token was already revoked, someone compromised the token chain!
    if (stored.revokedAt) {
      // Invalidate all tokens for this user!
      await prisma.refreshToken.updateMany({
        where: { userId: stored.userId },
        data: { revokedAt: new Date() }
      });
      emitToUser(stored.userId, 'session:revoked', { sessionId: stored.id, reason: 'TOKEN_REUSE_DETECTED' });
      throw new UnauthorizedError('Token reuse detected. All sessions revoked for security.', 'TOKEN_REUSE');
    }

    if (new Date() > stored.expiresAt) {
      throw new UnauthorizedError('Refresh token expired. Please log in again.', 'TOKEN_EXPIRED');
    }

    // Rotate token: revoke old token, issue new token
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() }
    });

    const newRawToken = generateRefreshTokenString();
    await prisma.refreshToken.create({
      data: {
        userId: stored.userId,
        tokenHash: hashToken(newRawToken),
        deviceLabel: stored.deviceLabel,
        userAgent: userAgent || stored.userAgent,
        ip: ip || stored.ip,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
      }
    });

    const newAccessToken = generateAccessToken(stored.userId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRawToken
    };
  }

  async logout(rawRefreshToken?: string) {
    if (!rawRefreshToken) return;
    const tokenHash = hashToken(rawRefreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revokedAt: new Date() }
    });
  }

  async logoutAll(userId: string) {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() }
    });
    emitToUser(userId, 'session:revoked', { all: true });
  }

  async getSessions(userId: string) {
    const sessions = await prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' }
    });

    return sessions.map((s) => ({
      id: s.id,
      deviceLabel: s.deviceLabel,
      userAgent: s.userAgent,
      ip: s.ip,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt
    }));
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await prisma.refreshToken.findFirst({
      where: { id: sessionId, userId }
    });

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    await prisma.refreshToken.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() }
    });

    emitToUser(userId, 'session:revoked', { sessionId });
  }

  async usernameLogin(input: {
    username: string;
    userAgent?: string;
    ip?: string;
  }) {
    const rawName = (input.username || '').trim();
    if (!rawName) throw new BadRequestError('Username is required');

    const cleanHandle = rawName.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 30) || 'scholar';
    const email = `${cleanHandle}@guildup.dev`;

    // Check if user already exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { handle: cleanHandle },
          { name: { equals: rawName, mode: 'insensitive' } },
          { email }
        ]
      }
    });

    if (!user) {
      const passwordHash = await argon2.hash('ScholarPass123!');
      user = await prisma.user.create({
        data: {
          email,
          handle: cleanHandle,
          name: rawName,
          passwordHash,
          roleClass: 'Rune Scholar',
          avatarSeed: cleanHandle,
          avatarColor: '#14b8a6',
          level: 1,
          currentXp: 0,
          maxXp: 1000,
          totalXp: 0,
          dailyStreak: 1,
          settings: {
            create: {
              theme: 'DARK',
              soundEnabled: true,
              volume: 80,
              chimeEnabled: true,
              weeklyGoalMinutes: 600,
              recentSearches: []
            }
          }
        }
      });

      try {
        await prisma.guildMember.create({
          data: {
            guildId: 'shadow-protocol',
            userId: user.id,
            role: 'SCHOLAR'
          }
        });
      } catch {}
    }

    try {
      emitToGuild('shadow-protocol', 'guild:member_joined', {
        id: user.id,
        name: user.name,
        roleClass: user.roleClass,
        level: user.level || 1,
        status: 'In Guild Hall',
        isOnline: true,
        avatarSeed: user.avatarSeed,
        avatarColor: user.avatarColor,
        currentXp: user.currentXp || 0,
        maxXp: user.maxXp || 500
      });
      emitToGuild('shadow-protocol', 'guild:activity', {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        userName: user.name,
        userAvatarSeed: user.avatarSeed,
        userAvatarColor: user.avatarColor || '#06b6d4',
        actionText: 'entered the sanctum as',
        target: user.roleClass || 'Rune Scholar',
        timestamp: 'Just now',
        type: 'quest'
      });
    } catch {}

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshTokenString();
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    try {
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
          userAgent: input.userAgent,
          ip: input.ip
        }
      });
    } catch {}

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        handle: user.handle,
        roleClass: user.roleClass,
        level: user.level || 1,
        currentXp: user.currentXp || 0,
        maxXp: user.maxXp || 1000,
        dailyStreak: user.dailyStreak || 1,
        masteryScore: user.masteryScore || 0,
        avatarSeed: user.avatarSeed,
        avatarColor: user.avatarColor
      },
      accessToken,
      refreshToken
    };
  }
}

export const authService = new AuthService();
