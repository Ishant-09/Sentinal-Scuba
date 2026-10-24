import React from 'react';
import { Shield, Sparkles, ExternalLink, Github, Terminal, FileText, Bug } from 'lucide-react';
import { NavigationItem } from '../../types';

interface FooterProps {
  onOpenCodex: () => void;
  onOpenPatchNotes: () => void;
  onNavigateTo404: () => void;
  onReportBug: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCodex,
  onOpenPatchNotes,
  onNavigateTo404,
  onReportBug
}) => {
  return (
    <footer className="mt-12 pt-6 pb-8 border-t border-[#161d2b] text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-[#141d2c]/80 border border-teal-500/30 flex items-center justify-center p-0.5">
            <img src="/logo.png" alt="GuildUp Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-slate-300">GuildUp</span>
          <span className="text-[10px] text-slate-500 font-mono">v1.0.4</span>
        </div>

        {/* Center Minimalist Links */}
        <div className="flex items-center gap-5 flex-wrap justify-center text-[11px] font-mono">
          <button
            onClick={onOpenCodex}
            className="hover:text-teal-300 transition-colors flex items-center gap-1"
          >
            <FileText className="w-3 h-3 text-teal-400" />
            <span>Guild Codex</span>
          </button>

          <button
            onClick={onOpenPatchNotes}
            className="hover:text-teal-300 transition-colors flex items-center gap-1"
          >
            <Terminal className="w-3 h-3 text-teal-400" />
            <span>Patch Notes</span>
          </button>

          <button
            onClick={onReportBug}
            className="hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <Bug className="w-3 h-3 text-amber-400" />
            <span>Bug Bounty</span>
          </button>

          <button
            onClick={onNavigateTo404}
            className="hover:text-rose-300 transition-colors text-slate-500 hover:underline"
            title="Preview the Custom 404 Page"
          >
            <span>Preview 404</span>
          </button>
        </div>

        {/* Right Info */}
        <div className="text-[10px] font-mono text-slate-500">
          Built for Hacktober 2026 • SQL Party Master
        </div>
      </div>
    </footer>
  );
};
