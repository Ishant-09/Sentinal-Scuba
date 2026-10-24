import React from 'react';
import { Shield, Radio, Sparkles, Trophy, ChevronRight } from 'lucide-react';
import { Guild } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Avatar } from '../common/Avatar';

interface GuildHeaderProps {
  guild: Guild;
  onViewRoster?: () => void;
}

export const GuildHeader: React.FC<GuildHeaderProps> = ({ guild, onViewRoster }) => {
  const memberSeeds = ['ishant', 'aviral', 'ajay', 'eknaath', 'kai'];

  return (
    <div className="rounded-card bg-[#0e131d] border border-[#1a2333] p-5 sm:p-6 shadow-sm transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left Guild Identity */}
        <div className="flex items-start gap-4 min-w-0">
          {/* Emblem */}
          <div className="w-12 h-12 rounded-xl bg-[#141c2a] border border-teal-500/30 flex items-center justify-center text-teal-400 flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-teal-400" strokeWidth="1.8">
              <polygon points="12 2 20 6.5 20 15.5 12 21 4 15.5 4 6.5 12 2" />
              <polyline points="12 6.5 12 16.5" />
              <polyline points="7 9 17 14" />
              <polyline points="7 14 17 9" />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase font-sans">
                {guild.name}
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-950/70 text-teal-300 border border-teal-800/50 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-teal-400" />
                LV. {guild.level}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                {guild.onlineCount} Online
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121824] text-slate-400 border border-[#192230]">
                {guild.memberCount} members
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
              {guild.description}
            </p>
          </div>
        </div>

        {/* Right Guild XP & Members stack */}
        <div className="flex items-center gap-5 flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#161d2a]">
          {/* XP Bar */}
          <div className="min-w-[170px] flex-1 lg:flex-initial">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1 text-teal-300 font-semibold">
                <Sparkles className="w-3 h-3 text-teal-400" /> Guild XP
              </span>
              <span>{guild.currentXp.toLocaleString()} / {guild.maxXp.toLocaleString()}</span>
            </div>
            <ProgressBar
              value={guild.currentXp}
              max={guild.maxXp}
              barColor="bg-gradient-to-r from-teal-500 to-sky-500"
              height="h-1.5"
            />
          </div>

          {/* Member Avatars Stack */}
          <div
            onClick={onViewRoster}
            className="flex items-center gap-2 cursor-pointer group p-1.5 rounded-inner hover:bg-[#131a26] transition-colors"
            title="View party members"
          >
            <div className="flex items-center -space-x-2">
              {memberSeeds.map((seed, i) => (
                <div key={i} className="ring-2 ring-[#0e131d] rounded-full transition-transform group-hover:translate-x-0.5">
                  <Avatar seed={seed} size="xs" />
                </div>
              ))}
              <div className="w-6 h-6 rounded-full bg-[#151d2c] border border-[#202b3d] flex items-center justify-center text-[10px] font-mono font-bold text-teal-300 ring-2 ring-[#0e131d]">
                +3
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-colors hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
};
