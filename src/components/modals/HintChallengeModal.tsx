import React, { useState } from 'react';
import { X, Sparkles, Lightbulb, Swords, CheckCircle2, AlertCircle } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { MENTOR_ASTRA } from '../../data/mockData';
import confetti from 'canvas-confetti';

interface HintChallengeModalProps {
  isOpen: boolean;
  mode: 'hint' | 'challenge';
  onClose: () => void;
  onRewardXp?: (amount: number) => void;
}

export const HintChallengeModal: React.FC<HintChallengeModalProps> = ({
  isOpen,
  mode,
  onClose,
  onRewardXp
}) => {
  const [hintIndex, setHintIndex] = useState(0);
  const [selectedChallengeIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  if (!isOpen) return null;

  const currentChallenge = MENTOR_ASTRA.challenges[selectedChallengeIdx];

  const handleNextHint = () => {
    setHintIndex((prev) => (prev + 1) % MENTOR_ASTRA.hints.length);
  };

  const handleSelectAnswer = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);

    if (idx === currentChallenge.correctIndex) {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      onRewardXp?.(50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0d1629] border border-[#203254] rounded-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1b2a47] bg-[#0c1424]">
          <div className="flex items-center gap-3">
            <Avatar seed={MENTOR_ASTRA.name} size="sm" showStatus isOnline statusColor="bg-cyan-400" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white">{MENTOR_ASTRA.name}</h3>
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                  {MENTOR_ASTRA.role}
                </span>
              </div>
              <p className="text-[10px] font-mono text-cyan-400/80">{MENTOR_ASTRA.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {mode === 'hint' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                <span>Rune Master's Guidance</span>
              </div>

              <div className="p-4 rounded-inner bg-[#111c34] border border-[#1e2f54] text-xs text-slate-200 leading-relaxed italic">
                “{MENTOR_ASTRA.hints[hintIndex]}”
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-mono text-slate-400">
                  Hint {hintIndex + 1} of {MENTOR_ASTRA.hints.length}
                </span>
                <button
                  onClick={handleNextHint}
                  className="px-3 py-1.5 rounded-inner bg-[#142340] hover:bg-[#1d325c] text-cyan-300 border border-cyan-700/50 text-xs font-semibold transition-all"
                >
                  Next Strategy Hint
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-purple-400" />
                  {currentChallenge.title}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  +50 XP
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {currentChallenge.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {currentChallenge.options.map((opt, idx) => {
                  let btnStyle = 'bg-[#111c33] border-[#1e2f52] text-slate-300 hover:border-cyan-500/50';
                  if (answered) {
                    if (idx === currentChallenge.correctIndex) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (selectedOption === idx) {
                      btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={answered}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full text-left p-2.5 rounded-inner border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {answered && idx === currentChallenge.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="p-3 rounded-inner bg-[#0e1628] border border-[#1d2a45] text-xs leading-relaxed animate-in fade-in duration-200">
                  <span className="font-bold text-cyan-300 block mb-0.5">Explanation:</span>
                  <p className="text-slate-300">{currentChallenge.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
