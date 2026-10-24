import { prisma } from '../../lib/prisma.js';
import { NotFoundError, BadRequestError } from '../../lib/errors.js';

export class FriendService {
  async getFriends(userId: string) {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
        status: 'ACCEPTED'
      },
      include: {
        user: true,
        friend: true
      }
    });

    const friends = friendships.map((f) => {
      const isInitiator = f.userId === userId;
      const targetUser = isInitiator ? f.friend : f.user;
      return {
        id: targetUser.id,
        name: targetUser.name,
        roleClass: targetUser.roleClass,
        level: targetUser.level,
        status: 'In Study Room' as const,
        isOnline: true,
        avatarSeed: targetUser.avatarSeed,
        avatarColor: targetUser.avatarColor,
        currentXp: targetUser.currentXp,
        maxXp: targetUser.maxXp
      };
    });

    return friends;
  }

  async sendFriendRequest(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestError('Cannot friend yourself');
    }

    const target = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) throw new NotFoundError('Target adventurer not found');

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId: targetUserId },
          { userId: targetUserId, friendId: userId }
        ]
      }
    });

    if (existing) {
      return existing;
    }

    return await prisma.friendship.create({
      data: {
        userId,
        friendId: targetUserId,
        status: 'PENDING'
      }
    });
  }

  async acceptFriendRequest(userId: string, requesterId: string) {
    const friendship = await prisma.friendship.findFirst({
      where: {
        userId: requesterId,
        friendId: userId,
        status: 'PENDING'
      }
    });

    if (!friendship) {
      throw new NotFoundError('Pending friend request not found');
    }

    return await prisma.friendship.update({
      where: { id: friendship.id },
      data: { status: 'ACCEPTED' }
    });
  }

  async removeFriend(userId: string, targetUserId: string) {
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { userId, friendId: targetUserId },
          { userId: targetUserId, friendId: userId }
        ]
      }
    });
    return { success: true };
  }
}

export const friendService = new FriendService();
