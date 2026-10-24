import React from 'react';
import { Sparkles, Check } from 'lucide-react';
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
    <div className={`p-4 rounded-card bg-[#0e131d] border border-[#1a2333] shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-xs font-semibold text-slate-200">Weekly Study Target</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span className="text-teal-300 font-bold">{data.currentWeekXp}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{data.weeklyGoalXp} XP</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-950/80 text-teal-300 border border-teal-800/60 font-semibold ml-1">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="w-full h-1.5 bg-[#090d14] rounded-full overflow-hidden border border-[#1a2233]">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-sky-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Days Row */}
      <div className="grid grid-cols-7 gap-1.5 mt-3 pt-2.5 border-t border-[#161d2a] text-center">
        {data.days.map((d) => (
          <div
            key={d.day}
            className={`p-1 rounded-inner flex flex-col items-center transition-all ${
              d.isToday
                ? 'bg-teal-950/40 border border-teal-600/40'
                : 'bg-[#121824] border border-transparent'
            }`}
          >
            <span
              className={`text-[9px] font-mono block ${
                d.isToday ? 'text-teal-300 font-bold' : d.completed ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {d.day}
            </span>

            <div className="mt-1 flex items-center justify-center">
              {d.completed ? (
                <div className="w-3.5 h-3.5 rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-300">
                  <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                </div>
              ) : d.isToday ? (
                <div className="w-3.5 h-3.5 rounded-full bg-teal-400/20 border border-teal-400 flex items-center justify-center text-teal-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-[#18202e] border border-[#202b3d]" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
