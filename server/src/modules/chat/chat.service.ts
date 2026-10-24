import { prisma } from '../../lib/prisma.js';
import { generateUlid } from '../../lib/ids.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../lib/errors.js';
import { emitToChannel, broadcastAll } from '../../realtime/emitters.js';

export class ChatService {
  async getChannels(userId: string) {
    const membership = await prisma.guildMember.findFirst({
      where: { userId }
    });

    const guildId = membership?.guildId || 'shadow-protocol';

    const channels = await prisma.chatChannel.findMany({
      where: {
        OR: [{ guildId }, { scope: 'GUILD' }]
      },
      orderBy: { position: 'asc' }
    });

    return channels.map((c) => ({
      id: c.slug,
      channelId: c.id,
      name: c.name,
      desc: c.description || '',
      unread: 0
    }));
  }

  async getMessages(channelSlugOrId: string, before?: string, limit = 50) {
    // Find channel by slug or ID
    const channel = await prisma.chatChannel.findFirst({
      where: {
        OR: [{ id: channelSlugOrId }, { slug: channelSlugOrId }]
      }
    });

    if (!channel) {
      return [];
    }

    const where: any = {
      channelId: channel.id,
      deletedAt: null
    };

    if (before) {
      where.id = { lt: before };
    }

    const messages = await prisma.chatMessage.findMany({
      where,
      include: {
        sender: true,
        reactions: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100)
    });

    return messages.reverse().map((m) => {
      // Group reactions by emoji
      const reactionMap = new Map<string, { count: number; users: string[] }>();
      for (const r of m.reactions) {
        if (!reactionMap.has(r.emoji)) {
          reactionMap.set(r.emoji, { count: 0, users: [] });
        }
        const item = reactionMap.get(r.emoji)!;
        item.count++;
        item.users.push(r.user.name);
      }

      const reactions = Array.from(reactionMap.entries()).map(([emoji, data]) => ({
        emoji,
        count: data.count,
        users: data.users
      }));

      const timeStr = m.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return {
        id: m.id,
        senderName: m.sender.name,
        senderAvatar: m.sender.avatarSeed,
        senderRole: m.sender.roleClass,
        timestamp: timeStr,
        text: m.text,
        codeSnippet: m.codeSnippet || undefined,
        codeLanguage: m.codeLanguage || undefined,
        reactions,
        clientMsgId: m.clientMsgId || undefined
      };
    });
  }

  async sendMessage(userId: string, channelSlugOrId: string, input: {
    text: string;
    codeSnippet?: string;
    codeLanguage?: string;
    clientMsgId?: string;
    senderName?: string;
    senderAvatar?: string;
    senderRole?: string;
  }) {
    if (!input.text && !input.codeSnippet) {
      throw new BadRequestError('Message text or code snippet required');
    }

    if (input.text && input.text.length > 4000) {
      throw new BadRequestError('Message exceeds maximum limit of 4,000 characters');
    }

    if (input.codeSnippet && input.codeSnippet.length > 20000) {
      throw new BadRequestError('Code snippet exceeds maximum limit of 20,000 characters');
    }

    const channel = await prisma.chatChannel.findFirst({
      where: {
        OR: [{ id: channelSlugOrId }, { slug: channelSlugOrId }]
      }
    });

    if (!channel) throw new NotFoundError('Channel not found');

    // Deduplication on clientMsgId if provided
    if (input.clientMsgId) {
      const existing = await prisma.chatMessage.findFirst({
        where: { senderId: userId, clientMsgId: input.clientMsgId }
      });
      if (existing) {
        return existing;
      }
    }

    const sender = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const messageId = generateUlid();

    const created = await prisma.chatMessage.create({
      data: {
        id: messageId,
        channelId: channel.id,
        senderId: userId,
        text: input.text.trim(),
        codeSnippet: input.codeSnippet?.trim() || null,
        codeLanguage: input.codeLanguage || 'sql',
        clientMsgId: input.clientMsgId || null
      }
    });

    const timeStr = created.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const messageDto = {
      id: created.id,
      channelId: channel.slug,
      senderName: input.senderName || sender.name,
      senderAvatar: input.senderAvatar || sender.avatarSeed,
      senderRole: input.senderRole || sender.roleClass,
      timestamp: timeStr,
      text: created.text,
      codeSnippet: created.codeSnippet || undefined,
      codeLanguage: created.codeLanguage || undefined,
      reactions: [],
      clientMsgId: created.clientMsgId || undefined
    };

    // Broadcast in real-time to channel room and all connected sockets
    emitToChannel(channel.id, 'chat:message', { channelId: channel.slug, message: messageDto });
    emitToChannel(channel.slug, 'chat:message', { channelId: channel.slug, message: messageDto });
    broadcastAll('chat:message', { channelId: channel.slug, message: messageDto });

    return messageDto;
  }

  async toggleReaction(userId: string, messageId: string, emoji: string) {
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: { channel: true }
    });

    if (!message) throw new NotFoundError('Message not found');

    const existing = await prisma.messageReaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji
        }
      }
    });

    let added = false;
    if (existing) {
      await prisma.messageReaction.delete({
        where: { id: existing.id }
      });
      added = false;
    } else {
      await prisma.messageReaction.create({
        data: {
          messageId,
          userId,
          emoji
        }
      });
      added = true;
    }

    // Recalculate reactions for this message
    const allReactions = await prisma.messageReaction.findMany({
      where: { messageId },
      include: { user: true }
    });

    const reactionMap = new Map<string, { count: number; users: string[] }>();
    for (const r of allReactions) {
      if (!reactionMap.has(r.emoji)) {
        reactionMap.set(r.emoji, { count: 0, users: [] });
      }
      const item = reactionMap.get(r.emoji)!;
      item.count++;
      item.users.push(r.user.name);
    }

    const reactions = Array.from(reactionMap.entries()).map(([e, data]) => ({
      emoji: e,
      count: data.count,
      users: data.users
    }));

    const payload = {
      messageId,
      channelId: message.channel.slug,
      emoji,
      userId,
      added,
      reactions
    };

    emitToChannel(message.channelId, 'chat:reaction', payload);
    emitToChannel(message.channel.slug, 'chat:reaction', payload);

    return reactions;
  }
}

export const chatService = new ChatService();
