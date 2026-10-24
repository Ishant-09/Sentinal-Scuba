import { prisma } from '../../lib/prisma.js';

export interface CatalogSearchItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  category: 'quest' | 'member' | 'chamber' | 'boss' | 'nav';
  targetTab: string;
  filterQuery?: string;
  memberId?: string;
}

export class SearchService {
  async search(query: string, category?: string) {
    const q = (query || '').toLowerCase().trim();

    // 1. Quests
    const quests = await prisma.quest.findMany({
      where: q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { category: { contains: q, mode: 'insensitive' } }
            ]
          }
        : undefined,
      take: 10
    });

    const questItems: CatalogSearchItem[] = quests.map((quest) => ({
      id: quest.id,
      title: quest.title,
      subtitle: `${quest.description.substring(0, 50)}... (${quest.rewardXp} XP)`,
      badge: 'QUEST',
      category: 'quest',
      targetTab: 'quests',
      filterQuery: quest.category
    }));

    // 2. Members
    const members = await prisma.user.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { handle: { contains: q, mode: 'insensitive' } },
              { roleClass: { contains: q, mode: 'insensitive' } }
            ]
          }
        : undefined,
      take: 5
    });

    const memberItems: CatalogSearchItem[] = members.map((m) => ({
      id: m.id,
      title: m.name,
      subtitle: `${m.roleClass} • Level ${m.level} • In Study Room`,
      badge: 'PARTY',
      category: 'member',
      targetTab: 'friends',
      memberId: m.id
    }));

    // 3. Chambers
    const chambers = await prisma.studyRoom.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { topic: { contains: q, mode: 'insensitive' } }
            ]
          }
        : undefined,
      take: 5
    });

    const chamberItems: CatalogSearchItem[] = chambers.map((c) => ({
      id: c.id,
      title: c.name,
      subtitle: c.topic,
      badge: 'CHAMBER',
      category: 'chamber',
      targetTab: 'study_rooms'
    }));

    // 4. Boss Encounter
    const bossItem: CatalogSearchItem = {
      id: 'boss-query-devourer',
      title: 'The Query Devourer (Boss Arena)',
      subtitle: 'Legendary Raid Boss • Phase 2: The Join Labyrinth',
      badge: 'BOSS',
      category: 'boss',
      targetTab: 'boss_arena'
    };

    let all = [...questItems, ...memberItems, ...chamberItems, bossItem];

    if (category && category !== 'all') {
      all = all.filter((item) => item.category === category);
    }

    return all;
  }
}

export const searchService = new SearchService();
