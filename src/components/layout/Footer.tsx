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
    <footer className="mt-12 pt-6 pb-8 border-t border-[#162136] text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-cyan-400">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="font-bold text-slate-300">GuildUp</span>
          <span className="text-[10px] text-slate-500 font-mono">v1.0.4-beta</span>
        </div>

        {/* Center Minimalist Links */}
        <div className="flex items-center gap-5 flex-wrap justify-center text-[11px] font-mono">
          <button
            onClick={onOpenCodex}
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <FileText className="w-3 h-3 text-cyan-400" />
            <span>Guild Codex</span>
          </button>

          <button
            onClick={onOpenPatchNotes}
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <Terminal className="w-3 h-3 text-cyan-400" />
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
