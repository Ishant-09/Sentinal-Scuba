import React from 'react';
import { Swords, Clock, CheckCircle2, Lock, Flame, ChevronRight, Zap } from 'lucide-react';
import { BossEncounter } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

interface MissionBossCardProps {
  boss: BossEncounter;
  onEnterBossArena: () => void;
  onViewMissionDetails?: () => void;
}

export const MissionBossCard: React.FC<MissionBossCardProps> = ({
  boss,
  onEnterBossArena
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* LEFT SECTION — CURRENT MISSION (7 cols) */}
      <div className="lg:col-span-7 rounded-card bg-[#0b1222] border border-[#18233a] hover:border-[#203152] p-5 flex flex-col justify-between shadow-panel transition-all">
        <div>
          {/* Header & Label */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                CURRENT MISSION
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-300 font-bold">
              62%
            </span>
          </div>

          {/* Title & Description */}
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Master SQL in 6 Weeks
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            From SELECT statements to complex joins. Learn it together, prove your mastery, and prepare for the final encounter.
          </p>

          {/* Progress Bar */}
          <div className="mt-3.5">
            <ProgressBar
              value={62}
              max={100}
              barColor="bg-gradient-to-r from-cyan-400 to-teal-400"
              height="h-1.5"
            />
          </div>
        </div>

        {/* Compact Metadata Chips */}
        <div className="mt-4 pt-3.5 border-t border-[#141e33] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
          <div>
            <span className="text-slate-500 text-[10px] block">Chapter</span>
            <span className="text-slate-200 font-semibold truncate block mt-0.5">3: Join Trials</span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block">Timeline</span>
            <span className="text-slate-200 font-semibold block mt-0.5">Week 3 / 6</span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block">Remaining</span>
            <span className="text-amber-300 font-semibold block mt-0.5 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> 3d left
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block">Milestones</span>
            <span className="text-cyan-300 font-semibold block mt-0.5">4/8 done</span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION — BOSS ENCOUNTER (5 cols) */}
      <div className="lg:col-span-5 rounded-card bg-[#0b1222] border border-[#1d1f33] hover:border-[#2f233a] p-5 flex flex-col justify-between shadow-panel transition-all">
        <div>
          {/* Header & Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#1e101a] border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-rose-400 tracking-wider">
                BOSS ENCOUNTER
              </span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-900/60 font-bold uppercase">
              {boss.difficulty}
            </span>
          </div>

          {/* Boss Name & Phase */}
          <div className="mt-2.5">
            <h3 className="text-sm sm:text-base font-extrabold tracking-wide text-white uppercase font-sans">
              {boss.name}
            </h3>
            <p className="text-[11px] font-mono text-cyan-300 mt-0.5">
              {boss.currentPhase.name}
            </p>
          </div>

          {/* Boss HP / Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
              <span className="text-rose-300 font-semibold">Corruption Core</span>
              <span>{boss.overallProgress}%</span>
            </div>
            <ProgressBar
              value={boss.overallProgress}
              max={100}
              barColor="bg-gradient-to-r from-rose-500 to-amber-500"
              height="h-1.5"
            />
          </div>

          {/* Compact Phase Indicators */}
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono">
            {boss.phases.map((phase) => {
              if (phase.status === 'completed') {
                return (
                  <div
                    key={phase.number}
                    className="flex-1 py-1 px-1.5 rounded bg-[#0b191c] border border-emerald-900/60 text-emerald-300 flex items-center justify-center gap-1"
                  >
                    <span>P1</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                );
              }
              if (phase.status === 'active') {
                return (
                  <div
                    key={phase.number}
                    className="flex-1 py-1 px-1.5 rounded bg-[#1e101a] border border-rose-800 text-rose-300 flex items-center justify-center gap-1 font-bold animate-pulse"
                  >
                    <span>P2</span>
                    <Zap className="w-3 h-3 text-rose-400" />
                  </div>
                );
              }
              return (
                <div
                  key={phase.number}
                  className="flex-1 py-1 px-1.5 rounded bg-[#0a0f1c] border border-slate-800/80 text-slate-600 flex items-center justify-center gap-1"
                >
                  <span>P3</span>
                  <Lock className="w-2.5 h-2.5" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mt-4 pt-3 border-t border-[#181c2f]">
          <button
            onClick={onEnterBossArena}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-inner bg-[#1f1325] hover:bg-[#2b1833] text-rose-200 border border-rose-700/50 hover:border-rose-400 text-xs font-bold transition-all active:scale-[0.98] group"
          >
            <Swords className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-12 transition-transform" />
            <span>Enter Boss Arena</span>
            <ChevronRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
