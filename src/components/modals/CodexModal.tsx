import React from 'react';
import { X, Shield, BookOpen, Terminal, CheckCircle2 } from 'lucide-react';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'codex' | 'patch_notes';
}

export const CodexModal: React.FC<CodexModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0d1629] border border-[#203254] rounded-card shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1b2a47] bg-[#0c1424]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              {type === 'codex' ? <BookOpen className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {type === 'codex' ? 'GuildUp Codex & Adventurer Guide' : 'Release Notes — v1.0.4'}
              </h3>
              <p className="text-[10px] font-mono text-cyan-400">
                {type === 'codex' ? 'Relational Mastery System Directives' : 'The Join Trials Deployment'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          {type === 'codex' ? (
            <>
              <div>
                <h4 className="font-bold text-slate-100 flex items-center gap-1.5 mb-1 text-cyan-300">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" /> 1. Guild Formation & Synergy
                </h4>
                <p className="text-slate-400 text-[11px]">
                  Adventurers band together in guilds of up to 12 scholars. Every completed quest contributes collective XP toward the guild level, unlocking collective raid buffs.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 flex items-center gap-1.5 mb-1 text-cyan-300">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" /> 2. Raid Boss Encounters
                </h4>
                <p className="text-slate-400 text-[11px]">
                  Bosses embody catastrophic relational database phenomena (e.g. Cartesian storms, locking anomalies, table scans). Parties purge corruption by executing indexed spells together.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 flex items-center gap-1.5 mb-1 text-cyan-300">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" /> 3. Sanctuary Voice Aura
                </h4>
                <p className="text-slate-400 text-[11px]">
                  Gathering 3 or more party members in the Study Sanctuary activates a +15% XP aura during deep-work Pomodoro intervals.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#18233c]">
                  <span className="font-bold text-slate-200">Patch v1.0.4 — The Join Trials</span>
                  <span className="text-[10px] font-mono text-cyan-400">October 2026</span>
                </div>

                <ul className="space-y-2 text-[11px] text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Mobile Optimization:</strong> Complete responsive mobile menu, popout actions, and overflow containment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Interactive Boss Arena:</strong> Turn-based combat abilities with dynamic HP calculation and confetti victory triggers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Weekly Progress Bar:</strong> Daily tracking ticks, XP milestones, and streak multipliers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Pop-out Menus:</strong> Quick member whisper, study invite, and profile management flyouts.</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1b2a47] bg-[#0c1424] text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-inner bg-[#142340] hover:bg-[#1d325c] text-cyan-300 text-xs font-semibold transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
