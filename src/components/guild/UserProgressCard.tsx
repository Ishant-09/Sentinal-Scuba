import React from 'react';
import { User, Flame, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { ProgressBar } from '../common/ProgressBar';
import { WeeklyProgressBar } from '../common/WeeklyProgressBar';

interface UserProgressCardProps {
  user: UserProfile;
}

export const UserProgressCard: React.FC<UserProgressCardProps> = ({ user }) => {
  return (
    <div className="rounded-card bg-[#0e162b] border border-[#1d2b4a] p-4 shadow-panel flex flex-col justify-between h-full space-y-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#18233c] mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Your Progress
            </h3>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            Active Adventurer
          </span>
        </div>

        {/* User Identity Row */}
        <div className="flex items-center gap-3 p-2.5 rounded-inner bg-[#121c33]/70 border border-[#1e2f52]">
          <Avatar seed={user.avatarSeed} size="md" showStatus isOnline statusColor="bg-cyan-400" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
              <span className="text-xs font-mono font-bold text-cyan-300">
                Lv. {user.level}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">{user.roleClass}</p>
          </div>
        </div>

        {/* XP Row */}
        <div className="mt-3 p-2.5 rounded-inner bg-[#10192e] border border-[#1b2a47]">
          <div className="flex justify-between items-center text-[11px] font-mono mb-1.5">
            <span className="flex items-center gap-1 text-slate-300">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Current Level XP
            </span>
            <span className="text-cyan-300 font-semibold">{user.currentXp} / {user.maxXp} XP</span>
          </div>
          <ProgressBar
            value={user.currentXp}
            max={user.maxXp}
            barColor="bg-gradient-to-r from-cyan-400 to-blue-500"
            height="h-2"
            glow
          />
        </div>
      </div>

      {/* Dedicated Weekly Progress Bar */}
      <WeeklyProgressBar />

      {/* 3 Compact Metric Rows */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#18233c] text-center">
        {/* Streak */}
        <div className="p-2 rounded-inner bg-[#121c33] border border-[#1f3054] flex flex-col items-center">
          <div className="flex items-center gap-1 text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
            <span className="text-xs font-bold font-mono">{user.dailyStreak}d</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Daily Streak</span>
        </div>

        {/* Quests Completed */}
        <div className="p-2 rounded-inner bg-[#121c33] border border-[#1f3054] flex flex-col items-center">
          <div className="flex items-center gap-1 text-teal-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-bold font-mono">{user.questsCompletedThisWeek}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Quests (Week)</span>
        </div>

        {/* Mastery Score */}
        <div className="p-2 rounded-inner bg-[#121c33] border border-[#1f3054] flex flex-col items-center">
          <div className="flex items-center gap-1 text-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-xs font-bold font-mono">{user.masteryScore}%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Mastery</span>
        </div>
      </div>
    </div>
  );
};
