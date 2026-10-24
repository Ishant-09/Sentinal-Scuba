import React from 'react';
import { X, CheckCircle2, Clock, Sparkles, Database, ArrowRight } from 'lucide-react';
import { Quest } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

interface QuestDetailModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStep: (questId: string, stepId: number) => void;
  onCompleteQuest: (quest: Quest) => void;
}

export const QuestDetailModal: React.FC<QuestDetailModalProps> = ({
  quest,
  isOpen,
  onClose,
  onToggleStep,
  onCompleteQuest
}) => {
  if (!isOpen || !quest) return null;

  const completedStepsCount = quest.steps.filter((s) => s.completed).length;
  const isFullyComplete = completedStepsCount === quest.steps.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0d1629] border border-[#203254] rounded-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1b2a47] bg-[#0b1222]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                {quest.difficulty} QUEST
              </span>
              <h3 className="text-sm font-bold text-white">{quest.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Mission Objective</span>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed bg-[#111c34] p-3 rounded-inner border border-[#1e2f54]">
              {quest.objective}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-inner bg-[#10192e] border border-[#1b2a48]">
              <span className="text-slate-400 text-[10px] block">REWARD</span>
              <span className="text-cyan-300 font-bold flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> +{quest.rewardXp} XP
              </span>
            </div>
            <div className="p-2.5 rounded-inner bg-[#10192e] border border-[#1b2a48]">
              <span className="text-slate-400 text-[10px] block">ESTIMATED TIME</span>
              <span className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {quest.duration}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
              <span>Trial Milestones</span>
              <span className="text-cyan-300 font-semibold">{completedStepsCount} / {quest.steps.length} Steps</span>
            </div>
            <ProgressBar value={completedStepsCount} max={quest.steps.length} barColor="bg-cyan-400" height="h-2" glow />
          </div>

          {/* Steps Interactive Checklist */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Step-by-Step Directives
            </span>
            {quest.steps.map((st) => (
              <div
                key={st.id}
                onClick={() => onToggleStep(quest.id, st.id)}
                className={`p-3 rounded-inner border flex items-center gap-3 cursor-pointer transition-all ${
                  st.completed
                    ? 'bg-cyan-950/20 border-cyan-800/60 text-slate-300'
                    : 'bg-[#10192e] border-[#1d2d4d] text-slate-200 hover:border-cyan-500/40'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border ${
                  st.completed ? 'bg-cyan-500 border-cyan-400 text-[#070b13]' : 'border-slate-600 bg-slate-800'
                }`}>
                  {st.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className={`text-xs ${st.completed ? 'line-through text-slate-400' : ''}`}>
                  {st.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1b2a47] bg-[#0b1222] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-inner text-xs text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onCompleteQuest(quest);
              onClose();
            }}
            disabled={quest.completed}
            className={`px-4 py-2 rounded-inner text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
              quest.completed
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-400 text-[#070b13] active:scale-[0.98]'
            }`}
          >
            <span>{quest.completed ? 'Quest Cleared ✓' : 'Mark Quest Complete'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
