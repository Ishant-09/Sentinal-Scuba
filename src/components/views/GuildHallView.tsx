import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Swords,
  Activity,
  Headphones,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import { Guild, BossEncounter, Quest, ActivityItem, UserProfile } from '../../types';
import { GuildHeader } from '../guild/GuildHeader';
import { MissionBossCard } from '../guild/MissionBossCard';
import { ActiveQuests } from '../guild/ActiveQuests';
import { GuildActivityFeed } from '../guild/GuildActivityFeed';
import { UserProgressCard } from '../guild/UserProgressCard';
import { WeeklyProgressBar } from '../common/WeeklyProgressBar';
import { ProgressBar } from '../common/ProgressBar';

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
  onOpenStudySanctuary?: () => void;
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
  onViewRoster,
  onOpenStudySanctuary
}) => {
  // Clean Home View Tabs to avoid overwhelming the user
  const [activeTab, setActiveTab] = useState<'overview' | 'quests' | 'boss' | 'feed'>('overview');

  interface HomeTabItem {
    id: 'overview' | 'quests' | 'boss' | 'feed';
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }

  const tabs: HomeTabItem[] = [
    { id: 'overview', label: 'Study Hub', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'quests', label: 'Active Quests', icon: <Compass className="w-3.5 h-3.5" />, badge: `${quests.length}` },
    { id: 'boss', label: 'Boss Encounter', icon: <Swords className="w-3.5 h-3.5" /> },
    { id: 'feed', label: 'Party Feed', icon: <Activity className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-7 max-w-6xl mx-auto">
      {/* 1. CLEAN GUILD BANNER */}
      <GuildHeader guild={guild} onViewRoster={onViewRoster} />

      {/* 2. MINIMALIST SEGMENTED TABS — Keeps the page calm and uncluttered */}
      <div className="flex items-center justify-between pb-1 border-b border-[#161d2a]">
        <div className="flex items-center gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-inner text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#141b28] text-teal-300 border border-[#202b3d] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f1420]'
                }`}
              >
                <span className={isActive ? 'text-teal-400' : 'text-slate-500'}>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-teal-950 text-teal-300 border border-teal-800/60' : 'bg-[#121722] text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick jump to study room */}
        {onOpenStudySanctuary && (
          <button
            onClick={onOpenStudySanctuary}
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 transition-colors"
          >
            <Headphones className="w-3.5 h-3.5 text-teal-400" />
            <span>Enter Study Sanctuary</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 3. CLEAN TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Focused Study Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Primary Focus (7 cols) */}
            <div className="lg:col-span-7 rounded-card bg-[#0e131d] border border-[#1a2333] p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                      CURRENT STUDY MISSION
                    </span>
                  </div>
                  <span className="text-xs font-mono text-teal-300 font-bold">
                    62% Complete
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Master SQL in 6 Weeks
                </h2>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  From SELECT statements to complex relational joins. Work through chapter trials together, prove your mastery, and prepare for the final boss encounter.
                </p>

                {/* Progress */}
                <div className="mt-4">
                  <ProgressBar
                    value={62}
                    max={100}
                    barColor="bg-gradient-to-r from-teal-500 to-sky-500"
                    height="h-1.5"
                  />
                </div>
              </div>

              {/* Clean Milestones summary */}
              <div className="mt-5 pt-4 border-t border-[#161d2a] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Current Chapter</span>
                  <span className="text-slate-200 font-medium block mt-0.5">3: Join Trials</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Curriculum</span>
                  <span className="text-slate-200 font-medium block mt-0.5">Week 3 / 6</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Timeline</span>
                  <span className="text-amber-300/90 font-medium block mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> 3 days left
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Milestones</span>
                  <span className="text-teal-300 font-medium block mt-0.5">4/8 passed</span>
                </div>
              </div>
            </div>

            {/* Right Quick Action & Study Target (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <WeeklyProgressBar />

              {/* Quick Resume Card */}
              <div className="rounded-card bg-[#0e131d] border border-[#1a2333] p-4 flex items-center justify-between shadow-sm">
                <div className="min-w-0 pr-3">
                  <span className="text-[10px] font-mono text-teal-400 uppercase font-bold tracking-wider block">
                    Next Study Trial
                  </span>
                  <h4 className="text-xs font-bold text-slate-200 truncate mt-0.5">
                    {quests[0]?.title || 'The SELECT Awakening'}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    +{quests[0]?.rewardXp || 120} XP • {quests[0]?.duration || '20 min'}
                  </p>
                </div>

                <button
                  onClick={() => quests[0] && onSelectQuest(quests[0])}
                  className="px-3.5 py-2 rounded-inner bg-[#141d2c] hover:bg-[#1a263a] text-teal-200 border border-teal-800/40 hover:border-teal-500/50 text-xs font-semibold transition-all flex-shrink-0"
                >
                  Resume Quest
                </button>
              </div>
            </div>
          </div>

          {/* User Progress Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-12">
              <UserProgressCard user={user} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE QUESTS */}
      {activeTab === 'quests' && (
        <div className="animate-in fade-in duration-200">
          <ActiveQuests
            quests={quests}
            onSelectQuest={onSelectQuest}
            onViewAllQuests={onViewAllQuests}
            onQuestAction={onQuestAction}
          />
        </div>
      )}

      {/* TAB 3: BOSS ENCOUNTER */}
      {activeTab === 'boss' && (
        <div className="animate-in fade-in duration-200">
          <MissionBossCard
            boss={boss}
            onEnterBossArena={onEnterBossArena}
          />
        </div>
      )}

      {/* TAB 4: PARTY FEED */}
      {activeTab === 'feed' && (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
          <GuildActivityFeed activities={activities} />
        </div>
      )}
    </div>
  );
};
