import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  ArrowLeft,
  Terminal,
  GitBranch,
  Calculator,
  Code2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Quest, QuestDifficulty } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { QUEST_BANNERS } from '../../data/mockData';

interface QuestsViewProps {
  quests: Quest[];
  onSelectQuest: (quest: Quest) => void;
  onBackToGuildHall: () => void;
  onQuestAction: (quest: Quest) => void;
  globalSearchQuery?: string;
}

export const QuestsView: React.FC<QuestsViewProps> = ({
  quests,
  onSelectQuest,
  onBackToGuildHall,
  onQuestAction,
  globalSearchQuery = ''
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState('');

  // Keep local search synced with global search if entered from top bar
  useEffect(() => {
    if (globalSearchQuery) {
      setLocalSearch(globalSearchQuery);
    }
  }, [globalSearchQuery]);

  const activeSearch = localSearch || globalSearchQuery;

  const filteredQuests = quests.filter((q) => {
    const matchesDifficulty = filterDifficulty === 'ALL' || q.difficulty === filterDifficulty;
    const matchesTopic = selectedTopic === 'ALL' || q.category.toLowerCase().includes(selectedTopic.toLowerCase());
    const matchesSearch =
      q.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
      q.description.toLowerCase().includes(activeSearch.toLowerCase()) ||
      q.category.toLowerCase().includes(activeSearch.toLowerCase());
    return matchesDifficulty && matchesTopic && matchesSearch;
  });

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'python':
        return <Code2 className="w-5 h-5 text-teal-400" />;
      case 'terminal':
        return <Terminal className="w-5 h-5 text-sky-400" />;
      case 'git':
        return <GitBranch className="w-5 h-5 text-amber-400" />;
      default:
        return <Calculator className="w-5 h-5 text-purple-400" />;
    }
  };

  const getDifficultyBadge = (d: QuestDifficulty) => {
    switch (d) {
      case 'COMMON':
        return 'bg-teal-950/60 text-teal-300 border-teal-800/40';
      case 'RARE':
        return 'bg-sky-950/60 text-sky-300 border-sky-800/40';
      case 'EPIC':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/40';
      default:
        return 'bg-[#151c2a] text-slate-300 border-[#1e2738]';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-7 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#161d2a]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGuildHall}
            className="p-2 rounded-inner bg-[#121824] hover:bg-[#182030] text-slate-400 hover:text-white border border-[#1b2436] transition-colors"
            title="Back to Guild Hall"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Guild Quest Board</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800/60 font-semibold">
                Curriculum Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hands-on study trials in Python, Computer Programming, Git & GitHub, and Mathematics
            </p>
          </div>
        </div>

        {/* Search & Difficulty Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search Python, Git, Maths..."
              className="bg-[#0e131d] border border-[#1a2333] rounded-inner pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/60"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0e131d] p-1 rounded-inner border border-[#1a2333]">
            {['ALL', 'COMMON', 'RARE', 'EPIC'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                  filterDifficulty === diff
                    ? 'bg-teal-500 text-[#070b13]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOPIC CURRICULUM BANNERS (Python, Computer Programming, Git & GitHub, Mathematics) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Study Curriculum Tracks
          </span>
          {selectedTopic !== 'ALL' && (
            <button
              onClick={() => setSelectedTopic('ALL')}
              className="text-xs text-teal-400 hover:underline font-mono"
            >
              Reset Track Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {QUEST_BANNERS.map((banner) => {
            const isSelected = selectedTopic === banner.id;
            return (
              <div
                key={banner.id}
                onClick={() => setSelectedTopic(isSelected ? 'ALL' : banner.id)}
                className={`rounded-card p-4 border bg-gradient-to-b ${banner.bgGradient} transition-all cursor-pointer relative shadow-sm hover:scale-[1.01] ${
                  isSelected ? 'border-teal-400 ring-1 ring-teal-400/50' : banner.borderClass
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded bg-[#101724] border border-[#1a2538] flex items-center justify-center">
                    {getTopicIcon(banner.icon)}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#0b1019] text-slate-300 border border-[#182336]">
                    {banner.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight">{banner.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                  {banner.subtitle}
                </p>

                <div className="mt-3 pt-2.5 border-t border-[#162030] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">{banner.stats}</span>
                  <span className={`font-semibold ${isSelected ? 'text-teal-300' : 'text-slate-500'}`}>
                    {isSelected ? 'Active Track ✓' : 'Filter →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quests Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Showing {filteredQuests.length} Curriculum Quests</span>
          {activeSearch && <span>Filtered by: "{activeSearch}"</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.map((quest) => (
            <div
              key={quest.id}
              className="rounded-card bg-[#0e131d] border border-[#1a2333] hover:border-[#222e42] p-5 flex flex-col justify-between shadow-sm transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${getDifficultyBadge(
                      quest.difficulty
                    )}`}
                  >
                    {quest.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-teal-300/80 font-medium">{quest.category}</span>
                </div>

                <h3
                  onClick={() => onSelectQuest(quest)}
                  className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors cursor-pointer leading-snug"
                >
                  {quest.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2 min-h-[32px]">
                  {quest.description}
                </p>

                {/* Steps overview */}
                <div className="mt-3.5 space-y-1.5 pt-3 border-t border-[#161d2a]">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    Key Objectives
                  </span>
                  {quest.steps.map((st) => (
                    <div key={st.id} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          st.completed ? 'text-teal-400' : 'text-slate-600'
                        }`}
                      />
                      <span className={`truncate ${st.completed ? 'line-through text-slate-500' : ''}`}>
                        {st.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#161d2a] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-teal-300 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" /> +{quest.rewardXp} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {quest.duration}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                    <span>Progress</span>
                    <span className="text-slate-200">
                      {quest.progress}/{quest.maxProgress}
                    </span>
                  </div>
                  <ProgressBar
                    value={quest.progress}
                    max={quest.maxProgress}
                    barColor="bg-teal-400"
                    height="h-1.5"
                  />
                </div>
              </div>

              <button
                onClick={() => onQuestAction(quest)}
                className="w-full mt-4 py-2 px-3 rounded-inner bg-[#141d2c] hover:bg-[#1a2638] text-teal-200 border border-teal-800/40 hover:border-teal-500/50 text-xs font-semibold transition-all active:scale-[0.98]"
              >
                {quest.completed ? 'Review Quest' : quest.progress === 0 ? 'Begin Quest' : 'Continue Quest'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
