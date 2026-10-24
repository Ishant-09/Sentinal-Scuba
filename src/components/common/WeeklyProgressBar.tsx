import React from 'react';
import { Sparkles, Check, Flame } from 'lucide-react';
import { WeeklyProgressData } from '../../types';

interface WeeklyProgressBarProps {
  data?: WeeklyProgressData;
  className?: string;
}

const DEFAULT_WEEKLY_DATA: WeeklyProgressData = {
  currentWeekXp: 1420,
  weeklyGoalXp: 2000,
  multiplier: '+15% Party XP Aura',
  days: [
    { day: 'Mon', xp: 280, targetXp: 250, completed: true, isToday: false },
    { day: 'Tue', xp: 320, targetXp: 250, completed: true, isToday: false },
    { day: 'Wed', xp: 260, targetXp: 250, completed: true, isToday: false },
    { day: 'Thu', xp: 310, targetXp: 250, completed: true, isToday: false },
    { day: 'Fri', xp: 250, targetXp: 250, completed: true, isToday: true },
    { day: 'Sat', xp: 0, targetXp: 250, completed: false, isToday: false },
    { day: 'Sun', xp: 0, targetXp: 250, completed: false, isToday: false },
  ]
};

export const WeeklyProgressBar: React.FC<WeeklyProgressBarProps> = ({
  data = DEFAULT_WEEKLY_DATA,
  className = ''
}) => {
  const percentage = Math.min(Math.round((data.currentWeekXp / data.weeklyGoalXp) * 100), 100);

  return (
    <div className={`p-3.5 rounded-card bg-[#0e172a] border border-[#1e2f52] shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-100">Weekly XP Goal</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span className="text-cyan-300 font-bold">{data.currentWeekXp}</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">{data.weeklyGoalXp} XP</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold ml-1">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50 relative">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Days Row */}
      <div className="grid grid-cols-7 gap-1.5 mt-3 pt-2.5 border-t border-[#18233c] text-center">
        {data.days.map((d) => (
          <div
            key={d.day}
            className={`p-1 rounded-inner flex flex-col items-center transition-all ${
              d.isToday
                ? 'bg-cyan-950/60 border border-cyan-500/50'
                : 'bg-[#10192e] border border-transparent'
            }`}
          >
            <span
              className={`text-[9px] font-mono block ${
                d.isToday ? 'text-cyan-300 font-bold' : d.completed ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {d.day}
            </span>

            <div className="mt-1 flex items-center justify-center">
              {d.completed ? (
                <div className="w-3.5 h-3.5 rounded-full bg-teal-500/20 border border-teal-500/60 flex items-center justify-center text-teal-300">
                  <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                </div>
              ) : d.isToday ? (
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center text-cyan-300 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-700" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
