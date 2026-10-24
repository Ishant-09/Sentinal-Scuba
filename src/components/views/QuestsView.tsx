import React, { useState } from 'react';
import { Compass, Filter, CheckCircle2, Clock, Sparkles, Database, Search, ArrowLeft } from 'lucide-react';
import { Quest, QuestDifficulty } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

interface QuestsViewProps {
  quests: Quest[];
  onSelectQuest: (quest: Quest) => void;
  onBackToGuildHall: () => void;
  onQuestAction: (quest: Quest) => void;
}

export const QuestsView: React.FC<QuestsViewProps> = ({
  quests,
  onSelectQuest,
  onBackToGuildHall,
  onQuestAction
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredQuests = quests.filter((q) => {
    const matchesFilter = filterDifficulty === 'ALL' || q.difficulty === filterDifficulty;
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getDifficultyBadge = (d: QuestDifficulty) => {
    switch (d) {
      case 'COMMON':
        return 'bg-teal-950/70 text-teal-300 border-teal-700/60';
      case 'RARE':
        return 'bg-blue-950/70 text-blue-300 border-blue-700/60';
      case 'EPIC':
        return 'bg-purple-950/70 text-purple-300 border-purple-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1c2944]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGuildHall}
            className="p-1.5 rounded-inner bg-[#121d33] hover:bg-[#1a2b4d] text-slate-400 hover:text-white border border-[#203152] transition-colors"
            title="Back to Guild Hall"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Guild Quest Board</span>
            </h1>
            <p className="text-xs text-slate-400">Complete curriculum trials to earn party XP and unlock Boss Arena phases</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quests..."
              className="bg-[#0e1629] border border-[#1e2d4d] rounded-inner pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0e1629] p-1 rounded-inner border border-[#1e2d4d]">
            {['ALL', 'COMMON', 'RARE', 'EPIC'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                  filterDifficulty === diff
                    ? 'bg-cyan-500 text-[#070b13]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuests.map((quest) => (
          <div
            key={quest.id}
            className="rounded-card bg-[#0e162b] border border-[#1d2b4a] hover:border-[#2a3f6d] p-4 flex flex-col justify-between shadow-panel transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getDifficultyBadge(quest.difficulty)}`}>
                  {quest.difficulty}
                </span>
                <span className="text-[10px] font-mono text-cyan-400/80">{quest.category}</span>
              </div>

              <h3
                onClick={() => onSelectQuest(quest)}
                className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {quest.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {quest.description}
              </p>

              {/* Steps overview */}
              <div className="mt-3 space-y-1.5 pt-3 border-t border-[#17233a]">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Objectives</span>
                {quest.steps.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 text-[11px] text-slate-300">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        st.completed ? 'text-cyan-400' : 'text-slate-600'
                      }`}
                    />
                    <span className={`truncate ${st.completed ? 'line-through text-slate-500' : ''}`}>
                      {st.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#17233a] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> +{quest.rewardXp} XP
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {quest.duration}
                </span>
              </div>

              <div className="mt-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                  <span>Progress</span>
                  <span className="text-slate-200">{quest.progress}/{quest.maxProgress}</span>
                </div>
                <ProgressBar value={quest.progress} max={quest.maxProgress} barColor="bg-cyan-400" height="h-1.5" />
              </div>
            </div>

            <button
              onClick={() => onQuestAction(quest)}
              className="w-full mt-4 py-2 px-3 rounded-inner bg-[#142340] hover:bg-[#1d325c] text-cyan-200 border border-cyan-700/50 text-xs font-semibold transition-all active:scale-[0.98]"
            >
              {quest.completed ? 'Review Quest' : quest.progress === 0 ? 'Begin Quest' : 'Continue Quest'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
