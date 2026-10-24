import React, { useState } from 'react';
import { Trophy, Award, Lock, Sparkles, CheckCircle2, Compass, Swords, Headphones, Users, Database, Flame } from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';

export const AchievementsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'compass': return <Compass className="w-5 h-5 text-teal-400" />;
      case 'swords': return <Swords className="w-5 h-5 text-rose-400" />;
      case 'headphones': return <Headphones className="w-5 h-5 text-cyan-400" />;
      case 'database': return <Database className="w-5 h-5 text-purple-400" />;
      case 'flame': return <Flame className="w-5 h-5 text-amber-400" />;
      default: return <Users className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Mythic': return 'text-purple-400 bg-purple-950/80 border-purple-800';
      case 'Gold': return 'text-amber-300 bg-amber-950/80 border-amber-800';
      case 'Silver': return 'text-slate-200 bg-slate-800/80 border-slate-600';
      default: return 'text-orange-300 bg-orange-950/80 border-orange-800';
    }
  };

  const filtered = ACHIEVEMENTS_DATA.filter(
    (a) => activeCategory === 'ALL' || a.category.toUpperCase() === activeCategory
  );

  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1c2944]">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Guild Achievements & Trophies</span>
          </h1>
          <p className="text-xs text-slate-400">Unlock party titles, mastery badges, and permanent XP bonuses</p>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 bg-[#0e1629] p-1 rounded-inner border border-[#1e2d4d]">
          {['ALL', 'QUEST', 'STUDY', 'BOSS', 'SOCIAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-[#070b13]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ach) => (
          <div
            key={ach.id}
            className={`rounded-card p-4 border flex flex-col justify-between shadow-panel transition-all ${
              ach.unlocked
                ? 'bg-[#0e172d] border-cyan-800/50 hover:border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                : 'bg-[#0a0f1d] border-[#182338] opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getTierColor(ach.tier)}`}>
                  {ach.tier}
                </span>
                <span className="text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> +{ach.xpReward} XP
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border ${
                  ach.unlocked ? 'bg-cyan-950/80 border-cyan-700/60' : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {ach.unlocked ? getIcon(ach.icon) : <Lock className="w-5 h-5 text-slate-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-white truncate">{ach.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{ach.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#162238]">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                <span>{ach.unlocked ? 'Unlocked' : 'In Progress'}</span>
                <span>{ach.progress} / {ach.maxProgress}</span>
              </div>
              <ProgressBar
                value={ach.progress}
                max={ach.maxProgress}
                barColor={ach.unlocked ? 'bg-cyan-400' : 'bg-slate-700'}
                height="h-1.5"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
