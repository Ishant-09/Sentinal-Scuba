import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  Clock,
  CheckCircle,
  Sparkles,
  Search,
  Users,
  Shield,
  ArrowUpRight
} from 'lucide-react';
import { LeaderboardEntry } from '../../types';
import { Avatar } from '../common/Avatar';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  searchQuery?: string;
  onSelectMember?: (memberId: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  searchQuery = '',
  onSelectMember
}) => {
  const [filterScope, setFilterScope] = useState<'weekly' | 'all_time'>('weekly');
  const [localSearch, setLocalSearch] = useState('');

  const activeSearch = searchQuery || localSearch;

  const filteredEntries = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      e.roleClass.toLowerCase().includes(activeSearch.toLowerCase())
  );

  const topThree = filteredEntries.slice(0, 3);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          icon: <Medal className="w-4 h-4 text-amber-400" />
        };
      case 2:
        return {
          bg: 'bg-slate-400/20 text-slate-200 border-slate-400/50',
          icon: <Medal className="w-4 h-4 text-slate-300" />
        };
      case 3:
        return {
          bg: 'bg-amber-700/20 text-amber-400 border-amber-700/50',
          icon: <Medal className="w-4 h-4 text-amber-600" />
        };
      default:
        return {
          bg: 'bg-[#141b28] text-slate-400 border-[#1c2638]',
          icon: <span className="font-mono text-xs font-bold">#{rank}</span>
        };
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-7 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#161d2a]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#141d2c] border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Guild Leaderboard</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800/60 font-semibold">
                Weekly Standings
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Rankings based on completed curriculum study trials, focus hours, and party XP
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-inner bg-[#0e131d] border border-[#1a2333]">
            <button
              onClick={() => setFilterScope('weekly')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                filterScope === 'weekly'
                  ? 'bg-teal-500 text-[#070b13]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekly Sprint
            </button>
            <button
              onClick={() => setFilterScope('all_time')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                filterScope === 'all_time'
                  ? 'bg-teal-500 text-[#070b13]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All-Time Honor
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search adventurer..."
              className="bg-[#0e131d] border border-[#1a2333] rounded-inner pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/60"
            />
          </div>
        </div>
      </div>

      {/* Top 3 Podium (Only when not actively filtering away top 3) */}
      {topThree.length >= 3 && !activeSearch && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 */}
          <div className="rounded-card bg-[#0e131d] border border-[#1a2333] p-5 flex flex-col items-center text-center order-2 md:order-1 relative">
            <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-slate-400/20 border border-slate-400/50 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
              #2
            </div>
            <Avatar seed={topThree[1].avatarSeed} size="lg" />
            <h3 className="text-sm font-bold text-white mt-3 truncate">{topThree[1].name}</h3>
            <span className="text-[11px] text-slate-400">{topThree[1].roleClass}</span>
            <div className="mt-3 text-xs font-mono font-bold text-teal-300">
              {topThree[1].weeklyXp.toLocaleString()} XP
            </div>
            <div className="mt-1 text-[11px] text-slate-500 font-mono">
              {topThree[1].studyHours} hrs logged • {topThree[1].questsCompleted} quests
            </div>
          </div>

          {/* Rank 1 (Champion) */}
          <div className="rounded-card bg-gradient-to-b from-[#141c28] via-[#0e141f] to-[#0a0d14] border border-amber-500/40 p-6 flex flex-col items-center text-center order-1 md:order-2 shadow-sm relative">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-500 text-[#070b13] font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Trophy className="w-3 h-3" /> Party Champion
            </div>
            <Avatar seed={topThree[0].avatarSeed} size="xl" showStatus isOnline statusColor="bg-teal-400" />
            <h3 className="text-base font-bold text-white mt-3 truncate">{topThree[0].name}</h3>
            <span className="text-xs text-amber-300/90 font-medium">{topThree[0].roleClass}</span>
            <div className="mt-3 text-sm font-mono font-bold text-amber-400">
              {topThree[0].weeklyXp.toLocaleString()} XP
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">
              {topThree[0].studyHours} hrs logged • {topThree[0].questsCompleted} quests
            </div>
          </div>

          {/* Rank 3 */}
          <div className="rounded-card bg-[#0e131d] border border-[#1a2333] p-5 flex flex-col items-center text-center order-3 md:order-3 relative">
            <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-amber-700/20 border border-amber-700/50 flex items-center justify-center text-xs font-mono font-bold text-amber-500">
              #3
            </div>
            <Avatar seed={topThree[2].avatarSeed} size="lg" />
            <h3 className="text-sm font-bold text-white mt-3 truncate">{topThree[2].name}</h3>
            <span className="text-[11px] text-slate-400">{topThree[2].roleClass}</span>
            <div className="mt-3 text-xs font-mono font-bold text-teal-300">
              {topThree[2].weeklyXp.toLocaleString()} XP
            </div>
            <div className="mt-1 text-[11px] text-slate-500 font-mono">
              {topThree[2].studyHours} hrs logged • {topThree[2].questsCompleted} quests
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="rounded-card bg-[#0e131d] border border-[#1a2333] overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-[#161d2a] flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">Rank</span>
            <span>Adventurer</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="hidden sm:inline">Quests</span>
            <span className="hidden md:inline">Focus Time</span>
            <span className="hidden sm:inline">Streak</span>
            <span className="w-20 text-right">Weekly XP</span>
          </div>
        </div>

        <div className="divide-y divide-[#141b26]">
          {filteredEntries.map((entry) => {
            const badge = getRankBadge(entry.rank);
            return (
              <div
                key={entry.userId}
                onClick={() => onSelectMember?.(entry.userId)}
                className={`px-5 py-3.5 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                  entry.isCurrentUser
                    ? 'bg-teal-950/20 hover:bg-teal-950/30'
                    : 'hover:bg-[#121824]'
                }`}
              >
                {/* Left: Rank & Adventurer */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-8 h-8 rounded-inner flex items-center justify-center border flex-shrink-0 ${badge.bg}`}>
                    {badge.icon}
                  </div>

                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar seed={entry.avatarSeed} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 truncate">{entry.name}</span>
                        {entry.isCurrentUser && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                            YOU
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">Lv. {entry.level}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{entry.roleClass}</p>
                    </div>
                  </div>
                </div>

                {/* Right: Stats */}
                <div className="flex items-center gap-8 font-mono text-slate-300">
                  <span className="hidden sm:inline text-slate-400 text-center w-12">
                    {entry.questsCompleted}
                  </span>
                  <span className="hidden md:inline text-slate-400 text-center w-16">
                    {entry.studyHours}h
                  </span>
                  <div className="hidden sm:flex items-center gap-1 text-amber-400 w-12 justify-center">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{entry.streakDays}d</span>
                  </div>
                  <span className="w-20 text-right font-bold text-teal-300">
                    {entry.weeklyXp.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
