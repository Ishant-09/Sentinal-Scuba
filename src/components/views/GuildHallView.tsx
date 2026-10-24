import React from 'react';
import { Guild, BossEncounter, Quest, ActivityItem, UserProfile } from '../../types';
import { GuildHeader } from '../guild/GuildHeader';
import { MissionBossCard } from '../guild/MissionBossCard';
import { ActiveQuests } from '../guild/ActiveQuests';
import { GuildActivityFeed } from '../guild/GuildActivityFeed';
import { UserProgressCard } from '../guild/UserProgressCard';

interface GuildHallViewProps {
  guild: Guild;
  boss: BossEncounter;
  quests: Quest[];
  activities: ActivityItem[];
  user: UserProfile;
  onEnterBossArena: () => void;
  onSelectQuest: (quest: Quest) => void;
  onViewAllQuests: () => void;
  onQuestAction: (quest: Quest) => void;
  onViewRoster?: () => void;
}

export const GuildHallView: React.FC<GuildHallViewProps> = ({
  guild,
  boss,
  quests,
  activities,
  user,
  onEnterBossArena,
  onSelectQuest,
  onViewAllQuests,
  onQuestAction,
  onViewRoster
}) => {
  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* 1. GUILD HEADER CARD */}
      <GuildHeader guild={guild} onViewRoster={onViewRoster} />

      {/* 2. CURRENT MISSION AND BOSS ENCOUNTER */}
      <MissionBossCard
        boss={boss}
        onEnterBossArena={onEnterBossArena}
      />

      {/* 3. ACTIVE QUESTS */}
      <ActiveQuests
        quests={quests}
        onSelectQuest={onSelectQuest}
        onViewAllQuests={onViewAllQuests}
        onQuestAction={onQuestAction}
      />

      {/* 4. BOTTOM DASHBOARD SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Guild Activity Feed (7 cols) */}
        <div className="lg:col-span-7">
          <GuildActivityFeed activities={activities} />
        </div>

        {/* Your Progress (5 cols) */}
        <div className="lg:col-span-5">
          <UserProgressCard user={user} />
        </div>
      </div>
    </div>
  );
};
