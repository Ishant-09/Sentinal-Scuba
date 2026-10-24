import { prisma } from '../../lib/prisma.js';
import { NotFoundError, BadRequestError } from '../../lib/errors.js';
import { xpService } from '../xp/xp.service.js';
import { emitToUser, emitToGuild } from '../../realtime/emitters.js';

export class QuestService {
  async getQuests(userId: string, track?: string) {
    const where: any = {};
    if (track) {
      where.category = { contains: track, mode: 'insensitive' };
    }

    const quests = await prisma.quest.findMany({
      where,
      orderBy: { position: 'asc' }
    });

    const userProgress = await prisma.userQuestProgress.findMany({
      where: { userId }
    });

    const progressMap = new Map(userProgress.map((p) => [p.questId, p]));

    return quests.map((q) => {
      const prog = progressMap.get(q.id);
      const rawSteps = (Array.isArray(q.steps) ? q.steps : []) as { id: number; text: string }[];
      const completedSteps = prog?.completedSteps || [];

      const steps = rawSteps.map((s) => ({
        id: s.id,
        text: s.text,
        completed: completedSteps.includes(s.id)
      }));

      return {
        id: q.id,
        difficulty: q.difficulty,
        title: q.title,
        description: q.description,
        rewardXp: q.rewardXp,
        duration: q.duration,
        progress: completedSteps.length,
        maxProgress: rawSteps.length,
        completed: prog?.status === 'COMPLETED',
        category: q.category,
        objective: q.objective,
        steps
      };
    });
  }

  async getQuestById(questId: string, userId: string) {
    const q = await prisma.quest.findUnique({
      where: { id: questId }
    });

    if (!q) throw new NotFoundError('Quest not found');

    const prog = await prisma.userQuestProgress.findUnique({
      where: { userId_questId: { userId, questId } }
    });

    const rawSteps = (Array.isArray(q.steps) ? q.steps : []) as { id: number; text: string }[];
    const completedSteps = prog?.completedSteps || [];

    const steps = rawSteps.map((s) => ({
      id: s.id,
      text: s.text,
      completed: completedSteps.includes(s.id)
    }));

    return {
      id: q.id,
      difficulty: q.difficulty,
      title: q.title,
      description: q.description,
      rewardXp: q.rewardXp,
      duration: q.duration,
      progress: completedSteps.length,
      maxProgress: rawSteps.length,
      completed: prog?.status === 'COMPLETED',
      category: q.category,
      objective: q.objective,
      steps
    };
  }

  async startQuest(userId: string, questId: string) {
    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) throw new NotFoundError('Quest not found');

    const progress = await prisma.userQuestProgress.upsert({
      where: { userId_questId: { userId, questId } },
      update: {},
      create: {
        userId,
        questId,
        status: 'IN_PROGRESS',
        completedSteps: []
      }
    });

    emitToUser(userId, 'quest:progress', {
      questId,
      completedSteps: progress.completedSteps,
      status: progress.status,
      progress: progress.completedSteps.length,
      completed: false
    });

    return progress;
  }

  async completeStep(userId: string, questId: string, stepIndex: number) {
    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) throw new NotFoundError('Quest not found');

    const rawSteps = (Array.isArray(quest.steps) ? quest.steps : []) as { id: number; text: string }[];
    const stepCount = rawSteps.length;

    if (stepIndex < 1 || stepIndex > stepCount) {
      throw new BadRequestError(`Invalid step index ${stepIndex}`);
    }

    const progress = await prisma.userQuestProgress.upsert({
      where: { userId_questId: { userId, questId } },
      update: {},
      create: {
        userId,
        questId,
        status: 'IN_PROGRESS',
        completedSteps: []
      }
    });

    if (progress.completedSteps.includes(stepIndex)) {
      // Already completed, idempotent return
      return { progress, alreadyCompleted: true };
    }

    const updatedSteps = [...progress.completedSteps, stepIndex].sort((a, b) => a - b);
    const updated = await prisma.userQuestProgress.update({
      where: { id: progress.id },
      data: { completedSteps: updatedSteps }
    });

    // Calculate step XP: floor(0.8 * rewardXp / stepCount)
    const stepXp = Math.floor((0.8 * quest.rewardXp) / stepCount);

    await xpService.grantXp({
      userId,
      source: 'QUEST_STEP',
      sourceRef: `${questId}-step-${stepIndex}`,
      amount: stepXp,
      label: `Completed step in "${quest.title}"`
    });

    emitToUser(userId, 'quest:progress', {
      questId,
      completedSteps: updated.completedSteps,
      status: updated.status,
      progress: updated.completedSteps.length,
      completed: updated.status === 'COMPLETED'
    });

    return { progress: updated, alreadyCompleted: false };
  }

  async completeQuest(userId: string, questId: string) {
    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) throw new NotFoundError('Quest not found');

    const rawSteps = (Array.isArray(quest.steps) ? quest.steps : []) as { id: number; text: string }[];
    const stepCount = rawSteps.length;

    const progress = await prisma.userQuestProgress.findUnique({
      where: { userId_questId: { userId, questId } }
    });

    if (!progress) throw new BadRequestError('Quest not started yet');
    if (progress.status === 'COMPLETED') {
      return { progress, alreadyCompleted: true };
    }

    // Verify all steps are done
    if (progress.completedSteps.length < stepCount) {
      throw new BadRequestError('All steps must be completed before finalizing quest');
    }

    const updated = await prisma.userQuestProgress.update({
      where: { id: progress.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    // Calculate remainder XP: rewardXp - (stepCount * stepXp)
    const stepXp = Math.floor((0.8 * quest.rewardXp) / stepCount);
    const totalStepXpGiven = stepXp * stepCount;
    const remainderXp = quest.rewardXp - totalStepXpGiven;

    await xpService.grantXp({
      userId,
      source: 'QUEST_COMPLETE',
      sourceRef: `${questId}-complete`,
      amount: remainderXp,
      label: `Finalized Quest: ${quest.title}`
    });

    // Recompute user mastery score
    const totalQuests = await prisma.quest.count();
    const completedQuests = await prisma.userQuestProgress.count({
      where: { userId, status: 'COMPLETED' }
    });
    const masteryScore = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

    await prisma.user.update({
      where: { id: userId },
      data: { masteryScore }
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const membership = await prisma.guildMember.findFirst({ where: { userId } });

    if (membership && user) {
      emitToGuild(membership.guildId, 'guild:activity', {
        id: `act-${Date.now()}`,
        userName: user.name,
        userAvatarSeed: user.avatarSeed,
        userAvatarColor: user.avatarColor,
        actionText: 'completed curriculum quest',
        target: quest.title,
        timestamp: 'Just now',
        type: 'quest'
      });
    }

    emitToUser(userId, 'quest:progress', {
      questId,
      completedSteps: updated.completedSteps,
      status: 'COMPLETED',
      progress: stepCount,
      completed: true
    });

    return { progress: updated, alreadyCompleted: false };
  }

  async getHintChallenge(questId: string) {
    let challenge = await prisma.hintChallenge.findFirst({
      where: { questId }
    });

    if (!challenge) {
      // Default challenge for quest
      challenge = await prisma.hintChallenge.create({
        data: {
          questId,
          prompt: 'Which data structure provides amortized O(1) time complexity for lookup operations?',
          options: ['Binary Search Tree', 'Hash Map / Table', 'Singly Linked List', 'Max Binary Heap'],
          correctIndex: 1,
          hint: 'Think about key hashing and bucket array indexing.',
          xp: 50
        }
      });
    }

    return {
      id: challenge.id,
      questId: challenge.questId,
      prompt: challenge.prompt,
      options: challenge.options as string[],
      hint: challenge.hint,
      xp: challenge.xp
    };
  }

  async attemptChallenge(userId: string, challengeId: string, selectedIndex: number) {
    const challenge = await prisma.hintChallenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) throw new NotFoundError('Challenge not found');

    const isCorrect = challenge.correctIndex === selectedIndex;

    await prisma.hintAttempt.create({
      data: {
        userId,
        challengeId,
        selectedIndex,
        correct: isCorrect
      }
    });

    if (isCorrect) {
      await xpService.grantXp({
        userId,
        source: 'CHALLENGE',
        sourceRef: `challenge-${challengeId}`,
        amount: challenge.xp,
        label: `Solved Mentor Astra's Challenge`
      });
    }

    return {
      correct: isCorrect,
      correctIndex: challenge.correctIndex,
      xpAwarded: isCorrect ? challenge.xp : 0
    };
  }
}

export const questService = new QuestService();
