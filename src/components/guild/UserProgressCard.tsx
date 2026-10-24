import React from 'react';
import { User, Flame, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { ProgressBar } from '../common/ProgressBar';

interface UserProgressCardProps {
  user: UserProfile;
}

export const UserProgressCard: React.FC<UserProgressCardProps> = ({ user }) => {
  return (
    <div className="rounded-card bg-[#0e131d] border border-[#1a2333] p-5 shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#161d2a]">
        <div className="flex items-center gap-3">
          <Avatar seed={user.avatarSeed} size="md" showStatus isOnline statusColor="bg-teal-400" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{user.name}</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-950/80 text-teal-300 border border-teal-800/60 font-semibold">
                Lv. {user.level}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.roleClass}</p>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="min-w-[200px]">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-teal-300 font-semibold">
              <Sparkles className="w-3 h-3 text-teal-400" /> Level Progress
            </span>
            <span>{user.currentXp} / {user.maxXp} XP</span>
          </div>
          <ProgressBar
            value={user.currentXp}
            max={user.maxXp}
            barColor="bg-gradient-to-r from-teal-500 to-sky-500"
            height="h-1.5"
          />
        </div>
      </div>

      {/* 3 Metric Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2.5 rounded-inner bg-[#121824] border border-[#192230]">
          <div className="flex items-center justify-center gap-1.5 text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold font-mono">{user.dailyStreak} Days</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Daily Study Streak</span>
        </div>

        <div className="p-2.5 rounded-inner bg-[#121824] border border-[#192230]">
          <div className="flex items-center justify-center gap-1.5 text-teal-300">
            <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-bold font-mono">{user.questsCompletedThisWeek} Quests</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Cleared This Week</span>
        </div>

        <div className="p-2.5 rounded-inner bg-[#121824] border border-[#192230]">
          <div className="flex items-center justify-center gap-1.5 text-sky-300">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-bold font-mono">{user.masteryScore}%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Curriculum Mastery</span>
        </div>
      </div>
    </div>
  );
};
