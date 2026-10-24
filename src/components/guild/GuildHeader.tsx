import React from 'react';
import { Shield, Users, Radio, Sparkles, Trophy } from 'lucide-react';
import { Guild } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Avatar } from '../common/Avatar';

interface GuildHeaderProps {
  guild: Guild;
  onViewRoster?: () => void;
}

export const GuildHeader: React.FC<GuildHeaderProps> = ({ guild, onViewRoster }) => {
  const memberSeeds = ['ishant', 'akira', 'mika', 'ren', 'kai'];

  return (
    <div className="rounded-card bg-gradient-to-r from-[#0d162b] via-[#101b36] to-[#0d162b] border border-[#1e2e4e] p-5 shadow-panel relative overflow-hidden">
      {/* Subtle geometric line overlay for RPG aesthetic, keeping strictly clean */}
      <div className="absolute right-0 top-0 w-96 h-full opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-cyan-400" strokeWidth="1">
          <polygon points="100,20 180,60 180,140 100,180 20,140 20,60" />
          <line x1="100" y1="20" x2="100" y2="180" />
          <line x1="20" y1="60" x2="180" y2="140" />
          <line x1="20" y1="140" x2="180" y2="60" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Guild Identity */}
        <div className="flex items-start gap-4 min-w-0">
          {/* Emblem */}
          <div className="w-12 h-12 rounded-card bg-[#0b1b36] border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-cyan-400" strokeWidth="1.8">
              <polygon points="12 2 20 6.5 20 15.5 12 21 4 15.5 4 6.5 12 2" />
              <polyline points="12 6.5 12 16.5" />
              <polyline points="7 9 17 14" />
              <polyline points="7 14 17 9" />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-black tracking-wider text-white uppercase font-sans">
                {guild.name}
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-cyan-400" />
                LV. {guild.level}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                {guild.onlineCount} Online
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {guild.memberCount} members
              </span>
            </div>

            <p className="text-xs text-slate-300/90 mt-1 max-w-xl leading-relaxed">
              {guild.description}
            </p>
          </div>
        </div>

        {/* Right Guild XP & Members stack */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-shrink-0">
          {/* XP Bar */}
          <div className="min-w-[170px] bg-[#0c1426]/70 p-2.5 rounded-inner border border-[#1b2b4a]">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1 text-cyan-300">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Guild XP
              </span>
              <span>{guild.currentXp.toLocaleString()} / {guild.maxXp.toLocaleString()}</span>
            </div>
            <ProgressBar
              value={guild.currentXp}
              max={guild.maxXp}
              barColor="bg-gradient-to-r from-cyan-500 to-blue-500"
              height="h-1.5"
              glow
            />
          </div>

          {/* Member Avatars Stack */}
          <div
            onClick={onViewRoster}
            className="flex items-center gap-2 cursor-pointer group p-1.5 rounded-inner hover:bg-[#13203c] transition-colors"
            title="View full guild roster"
          >
            <div className="flex items-center -space-x-2">
              {memberSeeds.map((seed, i) => (
                <div key={i} className="ring-2 ring-[#101b36] rounded-full transition-transform group-hover:translate-x-0.5">
                  <Avatar seed={seed} size="xs" />
                </div>
              ))}
              <div className="w-6 h-6 rounded-full bg-[#162544] border border-[#253961] flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300 ring-2 ring-[#101b36]">
                +3
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
