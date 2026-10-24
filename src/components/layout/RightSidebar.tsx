import React, { useState } from 'react';
import {
  Users,
  Search,
  Sparkles,
  Lightbulb,
  Swords,
  X
} from 'lucide-react';
import { GuildMember, StudyRoom } from '../../types';
import { Avatar } from '../common/Avatar';
import { MENTOR_ASTRA } from '../../data/mockData';

interface RightSidebarProps {
  members: GuildMember[];
  studyRoom?: StudyRoom;
  onJoinStudyRoom?: () => void;
  onLeaveStudyRoom?: () => void;
  isVoiceConnected?: boolean;
  onOpenStudyChat?: () => void;
  onOpenMentorHint: () => void;
  onOpenMentorChallenge: () => void;
  onMemberClick?: (member: GuildMember) => void;
  onCloseMobile?: () => void;
  isMobileDrawer?: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  members,
  onOpenMentorHint,
  onOpenMentorChallenge,
  onMemberClick,
  onCloseMobile,
  isMobileDrawer = false
}) => {
  const [memberFilter, setMemberFilter] = useState('');

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberFilter.toLowerCase()) ||
      m.roleClass.toLowerCase().includes(memberFilter.toLowerCase()) ||
      m.status.toLowerCase().includes(memberFilter.toLowerCase())
  );

  const getStatusBadge = (status: GuildMember['status']) => {
    switch (status) {
      case 'In a quest':
        return { text: 'In a quest', color: 'text-amber-300 bg-amber-950/40 border-amber-800/40' };
      case 'In Study Room':
        return { text: 'In Study Room', color: 'text-teal-300 bg-teal-950/40 border-teal-800/40' };
      case 'In Guild Hall':
        return { text: 'In Guild Hall', color: 'text-slate-300 bg-slate-900/60 border-slate-700/40' };
      case 'In Boss Arena':
        return { text: 'In Boss Arena', color: 'text-rose-300 bg-rose-950/40 border-rose-800/40' };
      case 'Online':
        return { text: 'Online', color: 'text-emerald-300 bg-emerald-950/40 border-emerald-800/40' };
      default:
        return { text: 'Offline', color: 'text-slate-500 bg-slate-900/40 border-slate-800/40' };
    }
  };

  return (
    <aside
      className={`${
        isMobileDrawer
          ? 'w-80 max-w-[90vw] h-full flex flex-col bg-[#0c1018] border-l border-[#171f2e] shadow-2xl z-50'
          : 'hidden xl:flex w-[320px] flex-shrink-0 bg-[#0c1018] border-l border-[#171f2e] flex-col h-full select-none overflow-hidden'
      }`}
    >
      {/* 1. GUILD MEMBERS PANEL */}
      <div className="flex-1 min-h-0 flex flex-col border-b border-[#161d2b]">
        <div className="p-3.5 border-b border-[#161d2b] bg-[#0f1420]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-bold text-slate-200 tracking-wide">Guild Members</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/60 text-teal-300 border border-teal-800/50 font-semibold">
                {members.filter((m) => m.isOnline).length}/{members.length}
              </span>
              {isMobileDrawer && onCloseMobile && (
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  aria-label="Close party panel"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick search input */}
          <div className="mt-2.5 relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              placeholder="Filter party members..."
              className="w-full bg-[#111724] border border-[#1a2333] rounded-inner pl-8 pr-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
            />
          </div>
        </div>

        {/* Member Scrollable List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredMembers.map((member) => {
            const statusConfig = getStatusBadge(member.status);
            return (
              <div
                key={member.id}
                onClick={() => onMemberClick?.(member)}
                className="flex items-center justify-between p-2 rounded-inner hover:bg-[#121824] border border-transparent hover:border-[#1a2333] transition-all cursor-pointer group"
                title={`Click to open ${member.name} actions`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    seed={member.avatarSeed}
                    size="sm"
                    showStatus
                    isOnline={member.isOnline}
                    statusColor={member.status === 'In Boss Arena' ? 'bg-rose-400' : 'bg-teal-400'}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-teal-200 truncate">
                        {member.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 px-1 py-0.2 rounded bg-[#151c2a] border border-[#1e2738]">
                        Lv. {member.level}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{member.roleClass}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-2">
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border inline-block whitespace-nowrap ${statusConfig.color}`}
                  >
                    {statusConfig.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. GUILD MASTER NPC PANEL */}
      <div className="p-3.5 border-b border-[#161d2b] bg-[#0e131d]">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar seed={MENTOR_ASTRA.name} size="md" showStatus isOnline statusColor="bg-teal-400" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#121926] border border-teal-500/50 flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-teal-300" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                {MENTOR_ASTRA.name}
              </h4>
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 bg-teal-950/70 text-teal-300 border border-teal-800/60 rounded">
                {MENTOR_ASTRA.role}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{MENTOR_ASTRA.title}</p>
          </div>
        </div>

        {/* NPC Speech bubble */}
        <div className="mt-2.5 p-2.5 rounded-inner bg-[#121824] border border-[#1a2333] text-[11px] text-slate-300 leading-relaxed italic relative">
          {MENTOR_ASTRA.message}
        </div>

        {/* NPC Actions */}
        <div className="grid grid-cols-2 gap-2 mt-2.5">
          <button
            onClick={() => {
              onOpenMentorHint();
              if (isMobileDrawer && onCloseMobile) onCloseMobile();
            }}
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-inner bg-[#121824] hover:bg-[#182030] text-teal-300 border border-[#1d273a] hover:border-teal-500/40 text-[11px] font-semibold transition-all active:scale-[0.98]"
          >
            <Lightbulb className="w-3.5 h-3.5 text-teal-400" />
            <span>Hint</span>
          </button>
          <button
            onClick={() => {
              onOpenMentorChallenge();
              if (isMobileDrawer && onCloseMobile) onCloseMobile();
            }}
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-inner bg-[#121824] hover:bg-[#182030] text-purple-300 border border-[#1d273a] hover:border-purple-500/40 text-[11px] font-semibold transition-all active:scale-[0.98]"
          >
            <Swords className="w-3.5 h-3.5 text-purple-400" />
            <span>Challenge</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
