import React from 'react';
import { Compass, Database, Link as LinkIcon, Scroll, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Quest, QuestDifficulty } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

interface ActiveQuestsProps {
  quests: Quest[];
  onSelectQuest: (quest: Quest) => void;
  onViewAllQuests: () => void;
  onQuestAction: (quest: Quest) => void;
}

export const ActiveQuests: React.FC<ActiveQuestsProps> = ({
  quests,
  onSelectQuest,
  onViewAllQuests,
  onQuestAction
}) => {
  // Grab top 3 quests as specified
  const displayQuests = quests.slice(0, 3);

  const getDifficultyConfig = (difficulty: QuestDifficulty) => {
    switch (difficulty) {
      case 'COMMON':
        return {
          badgeClass: 'bg-teal-950/70 text-teal-300 border-teal-800/60',
          dotClass: 'bg-teal-400',
          barColor: 'bg-teal-400',
          icon: <Database className="w-4 h-4 text-teal-400" />,
          cardBorder: 'hover:border-teal-500/40',
          buttonClass: 'bg-[#102428] hover:bg-[#16353b] text-teal-200 border-teal-700/50 hover:border-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.15)]'
        };
      case 'RARE':
        return {
          badgeClass: 'bg-blue-950/70 text-blue-300 border-blue-800/60',
          dotClass: 'bg-blue-400',
          barColor: 'bg-blue-400',
          icon: <LinkIcon className="w-4 h-4 text-blue-400" />,
          cardBorder: 'hover:border-blue-500/40',
          buttonClass: 'bg-[#111c38] hover:bg-[#18274f] text-blue-200 border-blue-700/50 hover:border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
        };
      case 'EPIC':
      default:
        return {
          badgeClass: 'bg-purple-950/70 text-purple-300 border-purple-800/60',
          dotClass: 'bg-purple-400',
          barColor: 'bg-purple-400',
          icon: <Scroll className="w-4 h-4 text-purple-400" />,
          cardBorder: 'hover:border-purple-500/40',
          buttonClass: 'bg-[#1c1333] hover:bg-[#281a49] text-purple-200 border-purple-700/50 hover:border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
        };
    }
  };

  const getButtonText = (quest: Quest) => {
    if (quest.completed) return 'Completed ✓';
    if (quest.progress === 0) return 'Begin Quest';
    if (quest.progress > 0 && quest.progress < quest.maxProgress) {
      return quest.id === 'quest-1' ? 'Resume Quest' : 'Continue';
    }
    return 'Review Quest';
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Active Quests</h3>
            <p className="text-[11px] text-slate-400">Collaborative learning milestones & trials</p>
          </div>
        </div>

        <button
          onClick={onViewAllQuests}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 3 Quest Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {displayQuests.map((quest) => {
          const config = getDifficultyConfig(quest.difficulty);
          const isFinished = quest.completed || quest.progress >= quest.maxProgress;

          return (
            <div
              key={quest.id}
              className={`rounded-card bg-[#0e162b] border border-[#1d2b4a] ${config.cardBorder} p-4 flex flex-col justify-between transition-all duration-200 shadow-panel relative group`}
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold tracking-wider flex items-center gap-1.5 ${config.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
                    {quest.difficulty}
                  </span>

                  <div className="w-7 h-7 rounded bg-[#131d36] border border-[#1e2f54] flex items-center justify-center">
                    {config.icon}
                  </div>
                </div>

                {/* Title & Description */}
                <h4
                  onClick={() => onSelectQuest(quest)}
                  className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-cyan-200 transition-colors cursor-pointer leading-snug line-clamp-1"
                >
                  {quest.title}
                </h4>

                <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed min-h-[34px]">
                  {quest.description}
                </p>

                {/* Metadata: XP & Duration */}
                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    +{quest.rewardXp} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {quest.duration}
                  </span>
                </div>

                {/* Thin Progress Bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                    <span>Progress</span>
                    <span className="font-semibold text-slate-200">
                      {quest.progress}/{quest.maxProgress}
                    </span>
                  </div>
                  <ProgressBar
                    value={quest.progress}
                    max={quest.maxProgress}
                    barColor={config.barColor}
                    height="h-1.5"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onQuestAction(quest)}
                disabled={isFinished}
                className={`w-full mt-4 py-2 px-3 rounded-inner text-xs font-semibold border transition-all active:scale-[0.98] ${
                  isFinished
                    ? 'bg-[#0f1d24] text-teal-400 border-teal-800/40 cursor-default'
                    : config.buttonClass
                }`}
              >
                {getButtonText(quest)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
