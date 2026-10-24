import React from 'react';
import { Activity, CheckCircle2, TrendingUp, Trophy, Headphones, Swords } from 'lucide-react';
import { ActivityItem } from '../../types';
import { Avatar } from '../common/Avatar';

interface GuildActivityFeedProps {
  activities: ActivityItem[];
}

export const GuildActivityFeed: React.FC<GuildActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'quest':
        return <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />;
      case 'level':
        return <TrendingUp className="w-3.5 h-3.5 text-amber-400" />;
      case 'achievement':
        return <Trophy className="w-3.5 h-3.5 text-purple-400" />;
      case 'study':
        return <Headphones className="w-3.5 h-3.5 text-cyan-400" />;
      case 'boss':
        return <Swords className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="rounded-card bg-[#0e162b] border border-[#1d2b4a] p-4 shadow-panel flex flex-col h-full">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-[#18233c] mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Guild Activity Feed
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Live feed</span>
      </div>

      {/* Feed list */}
      <div className="space-y-3 overflow-y-auto pr-1 flex-1">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-2 rounded-inner hover:bg-[#121c33] transition-colors border border-transparent hover:border-[#1d2d4d]"
          >
            {/* User Avatar */}
            <Avatar seed={item.userAvatarSeed} size="sm" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-300 leading-snug">
                <span className="font-semibold text-slate-100">{item.userName}</span>{' '}
                <span className="text-slate-400">{item.actionText}</span>{' '}
                <span className="font-semibold text-cyan-300">{item.target}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-slate-500">
                {getActivityIcon(item.type)}
                <span>{item.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
