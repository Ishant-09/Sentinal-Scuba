import React from 'react';
import { Target, Swords, Clock, CheckCircle2, Lock, Flame, ChevronRight, Zap } from 'lucide-react';
import { BossEncounter } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

interface MissionBossCardProps {
  boss: BossEncounter;
  onEnterBossArena: () => void;
  onViewMissionDetails?: () => void;
}

export const MissionBossCard: React.FC<MissionBossCardProps> = ({
  boss,
  onEnterBossArena,
  onViewMissionDetails
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* LEFT SECTION — CURRENT MISSION (7 cols) */}
      <div className="lg:col-span-7 rounded-card bg-[#0e172c] border border-[#1e2e4e] p-4 sm:p-5 flex flex-col justify-between shadow-panel relative group hover:border-[#283d66] transition-colors">
        <div>
          {/* Header & Label */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                CURRENT MISSION
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 font-bold">
              62% Progress
            </span>
          </div>

          {/* Title & Description */}
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Master SQL in 6 Weeks
          </h2>
          <p className="text-xs text-slate-300/80 mt-1.5 leading-relaxed">
            From SELECT statements to complex joins. Learn it together, prove your mastery, and prepare for the final encounter.
          </p>

          {/* Progress Bar */}
          <div className="mt-3">
            <ProgressBar
              value={62}
              max={100}
              barColor="bg-gradient-to-r from-cyan-400 to-teal-400"
              height="h-2"
              glow
            />
          </div>
        </div>

        {/* Compact Metadata Chips */}
        <div className="mt-4 pt-3 border-t border-[#1b2844] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded-inner bg-[#121d36] border border-[#1e2f52] flex flex-col justify-center">
            <span className="text-slate-400">Chapter</span>
            <span className="text-slate-100 font-semibold truncate mt-0.5" title="Chapter 3 — The Join Trials">
              3: The Join Trials
            </span>
          </div>

          <div className="p-2 rounded-inner bg-[#121d36] border border-[#1e2f52] flex flex-col justify-center">
            <span className="text-slate-400">Timeline</span>
            <span className="text-slate-100 font-semibold mt-0.5">Week 3 / 6</span>
          </div>

          <div className="p-2 rounded-inner bg-[#121d36] border border-[#1e2f52] flex flex-col justify-center">
            <span className="text-slate-400">Remaining</span>
            <span className="text-amber-300 font-semibold mt-0.5 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> 3 days left
            </span>
          </div>

          <div className="p-2 rounded-inner bg-[#121d36] border border-[#1e2f52] flex flex-col justify-center">
            <span className="text-slate-400">Milestones</span>
            <span className="text-cyan-300 font-semibold mt-0.5">4/8 completed</span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION — BOSS ENCOUNTER (5 cols) */}
      <div className="lg:col-span-5 rounded-card bg-[#0e162a] border border-[#242138] p-4 sm:p-5 flex flex-col justify-between shadow-panel relative group hover:border-[#3d273a] transition-colors">
        {/* Subtle red/crimson gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

        <div>
          {/* Header & Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Abstract monster / corrupted index geometric emblem */}
              <div className="w-7 h-7 rounded bg-[#21111a] border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-rose-400" strokeWidth="2">
                  <path d="M12 2l3 6 6 1-4.5 4.5 1 6.5L12 17l-5.5 3 1-6.5L3 9l6-1z" />
                  <circle cx="12" cy="11" r="2" fill="#f43f5e" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-rose-400 tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-400" /> BOSS ENCOUNTER
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 font-bold uppercase tracking-wider">
              {boss.difficulty}
            </span>
          </div>

          {/* Boss Name & Phase */}
          <div className="mt-2.5">
            <h3 className="text-sm sm:text-base font-extrabold tracking-wide text-white uppercase font-sans">
              {boss.name}
            </h3>
            <p className="text-[11px] font-mono text-cyan-300 mt-0.5 flex items-center gap-1">
              <span>{boss.currentPhase.name}</span>
            </p>
          </div>

          {/* Boss HP / Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
              <span className="text-rose-300 font-semibold">Phase Health</span>
              <span>{boss.overallProgress}% Corrupted</span>
            </div>
            <ProgressBar
              value={boss.overallProgress}
              max={100}
              barColor="bg-gradient-to-r from-rose-500 to-amber-500"
              height="h-2"
              glow
            />
          </div>

          {/* Compact Phase Indicators */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-[10px] font-mono">
            {boss.phases.map((phase) => {
              if (phase.status === 'completed') {
                return (
                  <div
                    key={phase.number}
                    className="p-1.5 rounded bg-[#0f2122] border border-emerald-800/60 text-emerald-300 flex items-center justify-between"
                  >
                    <span>P1 Done</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                );
              }
              if (phase.status === 'active') {
                return (
                  <div
                    key={phase.number}
                    className="p-1.5 rounded bg-[#24131e] border border-rose-700 text-rose-300 flex items-center justify-between animate-pulse"
                  >
                    <span className="font-bold">P2 Active</span>
                    <Zap className="w-3 h-3 text-rose-400" />
                  </div>
                );
              }
              return (
                <div
                  key={phase.number}
                  className="p-1.5 rounded bg-[#101624] border border-slate-800 text-slate-500 flex items-center justify-between"
                >
                  <span>P3 Lock</span>
                  <Lock className="w-3 h-3 text-slate-600" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Action Button: Enter Boss Arena */}
        <div className="mt-4 pt-3 border-t border-[#1f2338]">
          <button
            onClick={onEnterBossArena}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-inner bg-[#26152a] hover:bg-[#341b3a] text-rose-200 border border-rose-600/50 hover:border-rose-400 text-xs font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)] active:scale-[0.98] group"
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
