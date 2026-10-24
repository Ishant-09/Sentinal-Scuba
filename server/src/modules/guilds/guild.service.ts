import crypto from 'crypto';
import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../../lib/errors.js';
import { emitToGuild } from '../../realtime/emitters.js';
import { redis } from '../../lib/redis.js';

export class GuildService {
  async getMyGuilds(userId: string) {
    const memberships = await prisma.guildMember.findMany({
      where: { userId },
      include: {
        guild: {
          include: {
            _count: {
              select: { members: true }
            }
          }
        }
      }
    });

    return memberships.map((m) => ({
      id: m.guild.id,
      name: m.guild.name,
      tag: m.guild.tag,
      level: m.guild.level,
      currentXp: m.guild.currentXp,
      maxXp: m.guild.maxXp,
      memberCount: m.guild._count.members,
      maxMembers: 12,
      onlineCount: 4,
      description: m.guild.description,
      emblemColor: m.guild.emblemColor,
      emblemIcon: m.guild.emblemIcon,
      inviteCode: m.guild.inviteCode,
      myRole: m.role
    }));
  }

  async getGuildById(guildId: string, userId: string) {
    const guild = await prisma.guild.findUnique({
      where: { id: guildId },
      include: {
        _count: { select: { members: true } }
      }
    });

    if (!guild) throw new NotFoundError('Guild not found');

    const memberCount = guild._count.members;

    return {
      id: guild.id,
      name: guild.name,
      tag: guild.tag,
      level: guild.level,
      currentXp: guild.currentXp,
      maxXp: guild.maxXp,
      memberCount,
      maxMembers: 12,
      onlineCount: Math.min(memberCount, 5),
      description: guild.description,
      emblemColor: guild.emblemColor,
      emblemIcon: guild.emblemIcon,
      inviteCode: guild.inviteCode
    };
  }

  async getGuildMembers(guildId: string) {
    const members = await prisma.guildMember.findMany({
      where: { guildId },
      include: {
        user: true
      },
      orderBy: { joinedAt: 'asc' }
    });

    return members.map((m) => {
      return {
        id: m.user.id,
        name: m.user.name,
        roleClass: m.user.roleClass,
        level: m.user.level,
        status: 'In Study Room' as const,
        isOnline: true,
        avatarSeed: m.user.avatarSeed,
        avatarColor: m.user.avatarColor,
        currentXp: m.user.currentXp,
        maxXp: m.user.maxXp,
        role: m.role
      };
    });
  }

  async createGuild(userId: string, input: {
    name: string;
    tag: string;
    description: string;
    emblemIcon?: string;
    emblemColor?: string;
  }) {
    const existing = await prisma.guild.findUnique({
      where: { tag: input.tag.toUpperCase() }
    });

    if (existing) {
      throw new ConflictError('Guild tag already taken', 'TAG_TAKEN');
    }

    const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const guild = await prisma.guild.create({
      data: {
        name: input.name,
        tag: input.tag.toUpperCase(),
        description: input.description,
        emblemIcon: input.emblemIcon || 'shield',
        emblemColor: input.emblemColor || '#14b8a6',
        inviteCode,
        createdBy: userId,
        members: {
          create: {
            userId,
            role: 'OWNER'
          }
        },
        channels: {
          createMany: {
            data: [
              { slug: 'sql-joins', name: 'sql-joins-room', description: 'SQL Queries & Joins' },
              { slug: 'general-study', name: 'general-study', description: 'General Focus & Study Chat' },
              { slug: 'boss-tactics', name: 'boss-tactics', description: 'Boss Raid Combat Tactics' }
            ]
          }
        }
      }
    });

    return guild;
  }

  async joinGuild(userId: string, inviteCode: string) {
    const guild = await prisma.guild.findUnique({
      where: { inviteCode: inviteCode.toUpperCase().trim() }
    });

    if (!guild) {
      throw new NotFoundError('Invalid invite code');
    }

    const existingMember = await prisma.guildMember.findUnique({
      where: { guildId_userId: { guildId: guild.id, userId } }
    });

    if (existingMember) {
      return guild;
    }

    await prisma.guildMember.create({
      data: {
        guildId: guild.id,
        userId,
        role: 'SCHOLAR'
      }
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      emitToGuild(guild.id, 'guild:activity', {
        id: `act-${Date.now()}`,
        userName: user.name,
        userAvatarSeed: user.avatarSeed,
        userAvatarColor: user.avatarColor,
        actionText: 'joined the guild roster',
        target: guild.name,
        timestamp: 'Just now',
        type: 'study'
      });
    }

    return guild;
  }

  async rotateInviteCode(guildId: string, userId: string) {
    const member = await prisma.guildMember.findUnique({
      where: { guildId_userId: { guildId, userId } }
    });

    if (!member || member.role !== 'OWNER') {
      throw new ForbiddenError('Only the guild owner can rotate invite code');
    }

    const newCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const updated = await prisma.guild.update({
      where: { id: guildId },
      data: { inviteCode: newCode }
    });

    return { inviteCode: updated.inviteCode };
  }

  async getGuildActivity(guildId: string) {
    const events = await prisma.activityEvent.findMany({
      where: { guildId },
      include: { actor: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    if (events.length === 0) {
      // Return default activities if freshly seeded
      return [
        {
          id: 'act-1',
          userName: 'Aviral Maurya',
          userAvatarSeed: 'aviral',
          userAvatarColor: '#38bdf8',
          actionText: 'cleared curriculum quest',
          target: 'Python Core & Scripting',
          timestamp: '10m ago',
          type: 'quest'
        },
        {
          id: 'act-2',
          userName: 'Eknaath Bawane',
          userAvatarSeed: 'eknaath',
          userAvatarColor: '#10b981',
          actionText: 'landed critical strike on',
          target: 'The Query Devourer',
          timestamp: '25m ago',
          type: 'boss'
        },
        {
          id: 'act-3',
          userName: 'Ajay Gurjar',
          userAvatarSeed: 'ajay',
          userAvatarColor: '#f59e0b',
          actionText: 'logged 50m focus session in',
          target: 'SQL Sanctuary',
          timestamp: '1h ago',
          type: 'study'
        }
      ];
    }

    return events.map((e) => ({
      id: e.id,
      userName: e.actor.name,
      userAvatarSeed: e.actor.avatarSeed,
      userAvatarColor: e.actor.avatarColor,
      actionText: e.text,
      target: (e.data as any)?.target || 'Guild',
      timestamp: 'Recently',
      type: e.type
    }));
  }
}

export const guildService = new GuildService();
