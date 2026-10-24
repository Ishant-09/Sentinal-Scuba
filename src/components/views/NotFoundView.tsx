import React from 'react';
import { Home, Compass, Swords, Search, ArrowLeft } from 'lucide-react';
import { NavigationItem } from '../../types';

interface NotFoundViewProps {
  onNavigate: (tab: NavigationItem) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12 text-center select-none">
      {/* Abstract Runic 404 Emblem */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-2xl bg-[#11192e] border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <svg viewBox="0 0 48 48" className="w-12 h-12 fill-none stroke-cyan-400" strokeWidth="2">
            <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" />
            <line x1="16" y1="16" x2="32" y2="32" stroke="#f43f5e" strokeWidth="2.5" />
            <line x1="32" y1="16" x2="16" y2="32" stroke="#f43f5e" strokeWidth="2.5" />
          </svg>
        </div>
        <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold">
          CODE 404
        </span>
      </div>

      {/* Title & Lore */}
      <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-sans">
        Rune Not Found
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
        The route or record you pursued has been severed or swallowed by the Query Devourer. No data exists in this relational partition.
      </p>

      {/* Return Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('guild_hall')}
          className="flex items-center gap-2 px-4 py-2 rounded-inner bg-cyan-500 hover:bg-cyan-400 text-[#070b13] font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98]"
        >
          <Home className="w-4 h-4" />
          <span>Return to Guild Hall</span>
        </button>

        <button
          onClick={() => onNavigate('quests')}
          className="flex items-center gap-2 px-4 py-2 rounded-inner bg-[#121c33] hover:bg-[#1a2b4e] text-slate-200 border border-[#203152] font-semibold text-xs transition-colors"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Browse Quests</span>
        </button>

        <button
          onClick={() => onNavigate('boss_arena')}
          className="flex items-center gap-2 px-4 py-2 rounded-inner bg-[#24131e] hover:bg-[#341b2c] text-rose-200 border border-rose-800/60 font-semibold text-xs transition-colors"
        >
          <Swords className="w-4 h-4 text-rose-400" />
          <span>Boss Arena</span>
        </button>
      </div>
    </div>
  );
};
