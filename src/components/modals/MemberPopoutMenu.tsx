import React from 'react';
import { MessageSquare, Radio, Shield, Swords, Sparkles, X, Check } from 'lucide-react';
import { GuildMember } from '../../types';
import { Avatar } from '../common/Avatar';

interface MemberPopoutMenuProps {
  member: GuildMember | null;
  isOpen: boolean;
  onClose: () => void;
  onWhisper: (member: GuildMember) => void;
  onInviteToStudy: (member: GuildMember) => void;
  onChallengeDuel: (member: GuildMember) => void;
}

export const MemberPopoutMenu: React.FC<MemberPopoutMenuProps> = ({
  member,
  isOpen,
  onClose,
  onWhisper,
  onInviteToStudy,
  onChallengeDuel
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-[#0e172e] border border-[#223661] rounded-card shadow-2xl p-4 relative animate-in zoom-in-95 duration-150 select-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 transition-colors"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Member Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#1b2b4d]">
          <Avatar seed={member.avatarSeed} size="md" showStatus isOnline={member.isOnline} statusColor="bg-cyan-400" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white truncate">{member.name}</h4>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Lv. {member.level}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">{member.roleClass}</p>
            <span className="text-[9px] font-mono text-cyan-400/90 block mt-0.5">
              ● {member.status}
            </span>
          </div>
        </div>

        {/* Pop-out Action Buttons */}
        <div className="mt-3 space-y-1.5 text-xs">
          <button
            onClick={() => {
              onWhisper(member);
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-inner text-slate-200 hover:text-white hover:bg-[#152342] border border-transparent hover:border-cyan-500/30 transition-all text-left"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Whisper Message</span>
          </button>

          <button
            onClick={() => {
              onInviteToStudy(member);
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-inner text-slate-200 hover:text-white hover:bg-[#152342] border border-transparent hover:border-cyan-500/30 transition-all text-left"
          >
            <Radio className="w-3.5 h-3.5 text-teal-400" />
            <span>Invite to Study Sanctuary</span>
          </button>

          <button
            onClick={() => {
              onChallengeDuel(member);
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-inner text-slate-200 hover:text-white hover:bg-[#152342] border border-transparent hover:border-rose-500/30 transition-all text-left"
          >
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span>Challenge to SQL Duel</span>
          </button>
        </div>

        {/* XP stats preview */}
        <div className="mt-3 pt-2.5 border-t border-[#1b2b4d] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Party Rank</span>
          <span className="text-cyan-300 font-semibold">Scholar Rank IV</span>
        </div>
      </div>
    </div>
  );
};
