import { prisma } from '../../lib/prisma.js';
import { generateUlid } from '../../lib/ids.js';
import { NotFoundError, BadRequestError } from '../../lib/errors.js';
import { emitToUser } from '../../realtime/emitters.js';

export class WhisperService {
  async getConversations(userId: string) {
    // Find all users with whom the current user has exchanged whispers
    const whispers = await prisma.whisper.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }]
      },
      include: {
        sender: true,
        recipient: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const partnerMap = new Map<string, any>();

    for (const w of whispers) {
      const isSender = w.senderId === userId;
      const partner = isSender ? w.recipient : w.sender;

      if (!partnerMap.has(partner.id)) {
        partnerMap.set(partner.id, {
          member: {
            id: partner.id,
            name: partner.name,
            handle: partner.handle,
            roleClass: partner.roleClass,
            level: partner.level,
            avatarSeed: partner.avatarSeed,
            avatarColor: partner.avatarColor,
            isOnline: true,
            status: 'In Study Room'
          },
          lastMessage: {
            text: w.text,
            createdAt: w.createdAt
          },
          unreadCount: 0
        });
      }

      if (!isSender && !w.readAt) {
        partnerMap.get(partner.id).unreadCount++;
      }
    }

    return Array.from(partnerMap.values());
  }

  async getMessages(userId: string, partnerIdOrHandle: string, before?: string, limit = 50) {
    const partner = await prisma.user.findFirst({
      where: {
        OR: [{ id: partnerIdOrHandle }, { handle: partnerIdOrHandle }]
      }
    });

    if (!partner) throw new NotFoundError('Adventurer not found');

    const where: any = {
      OR: [
        { senderId: userId, recipientId: partner.id },
        { senderId: partner.id, recipientId: userId }
      ]
    };

    if (before) {
      where.id = { lt: before };
    }

    const whispers = await prisma.whisper.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100)
    });

    return whispers.reverse().map((w) => ({
      id: w.id,
      senderId: w.senderId === userId ? 'user' : 'member',
      senderName: w.senderId === userId ? 'You' : partner.name,
      text: w.text,
      timestamp: w.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: !!w.readAt,
      clientMsgId: w.clientMsgId || undefined
    }));
  }

  async sendWhisper(userId: string, recipientIdOrHandle: string, input: { text: string; clientMsgId?: string }) {
    if (!input.text || !input.text.trim()) {
      throw new BadRequestError('Whisper text cannot be empty');
    }

    const recipient = await prisma.user.findFirst({
      where: {
        OR: [{ id: recipientIdOrHandle }, { handle: recipientIdOrHandle }]
      }
    });

    if (!recipient) throw new NotFoundError('Recipient not found');

    const sender = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const whisperId = generateUlid();

    const whisper = await prisma.whisper.create({
      data: {
        id: whisperId,
        senderId: userId,
        recipientId: recipient.id,
        text: input.text.trim(),
        clientMsgId: input.clientMsgId || null
      }
    });

    const timeStr = whisper.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const messageDto = {
      id: whisper.id,
      senderId: 'user',
      senderName: sender.name,
      text: whisper.text,
      timestamp: timeStr,
      read: false,
      clientMsgId: whisper.clientMsgId || undefined
    };

    // Emit to both recipient and all of sender's other devices
    emitToUser(recipient.id, 'whisper:new', {
      whisper: { ...messageDto, senderId: 'member' },
      partnerId: sender.id,
      partnerName: sender.name
    });

    emitToUser(userId, 'whisper:new', {
      whisper: messageDto,
      partnerId: recipient.id,
      partnerName: recipient.name
    });

    // Handle Astra NPC auto-reply if whisper is to Mentor Astra
    if (recipient.id === 'usr-astra-npc' || recipient.handle === 'astra' || recipient.name.includes('Astra')) {
      this.triggerAstraReply(userId, recipient.id, input.text.trim(), sender.name);
    }

    return messageDto;
  }

  private triggerAstraReply(userId: string, astraId: string, userText: string, userName: string) {
    // 1. Send typing indicator after 400ms
    setTimeout(() => {
      emitToUser(userId, 'whisper:typing', {
        memberId: astraId,
        isTyping: true
      });
    }, 400);

    // 2. Deliver Astra response after 1200ms
    setTimeout(async () => {
      try {
        const lower = userText.toLowerCase();
        let reply = `Greetings ${userName.split(' ')[0]}! Keep your relational focus sharp and press onward in your study quests.`;

        if (lower.includes('python') || lower.includes('code') || lower.includes('list')) {
          reply = `In Python, generators and list comprehensions conserve heap memory by evaluating elements lazily. Remember to define your base cases!`;
        } else if (lower.includes('boss') || lower.includes('query devourer') || lower.includes('raid')) {
          reply = `The Query Devourer Phase 2 relies heavily on unindexed nested loops. Cast Hash Join Cleave right after Index Surge to trigger a Relational Combo!`;
        } else if (lower.includes('git') || lower.includes('merge') || lower.includes('conflict')) {
          reply = `When resolving three-way Git conflicts, check the diff3 common ancestor with git checkout --conflict=diff3. Master interactive rebase!`;
        } else if (lower.includes('math') || lower.includes('induction') || lower.includes('proof')) {
          reply = `In discrete proofs, establishing your base case P(0) clearly is half the victory. The inductive hypothesis does the rest.`;
        }

        const astraWhisperId = generateUlid();
        const astraWhisper = await prisma.whisper.create({
          data: {
            id: astraWhisperId,
            senderId: astraId,
            recipientId: userId,
            text: reply
          }
        });

        emitToUser(userId, 'whisper:typing', {
          memberId: astraId,
          isTyping: false
        });

        emitToUser(userId, 'whisper:new', {
          whisper: {
            id: astraWhisper.id,
            senderId: 'member',
            senderName: 'Mentor Astra',
            text: astraWhisper.text,
            timestamp: astraWhisper.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: true
          },
          partnerId: astraId,
          partnerName: 'Mentor Astra'
        });
      } catch {
        // ignore
      }
    }, 1200);
  }

  async markAsRead(userId: string, partnerId: string) {
    await prisma.whisper.updateMany({
      where: {
        senderId: partnerId,
        recipientId: userId,
        readAt: null
      },
      data: {
        readAt: new Date()
      }
    });

    emitToUser(partnerId, 'whisper:read', {
      memberId: userId,
      readAt: new Date().toISOString()
    });

    return { success: true };
  }
}

export const whisperService = new WhisperService();
