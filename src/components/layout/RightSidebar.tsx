import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Sparkles,
  Headphones,
  Lightbulb,
  Swords,
  Radio,
  X
} from 'lucide-react';
import { GuildMember, StudyRoom } from '../../types';
import { Avatar } from '../common/Avatar';
import { MENTOR_ASTRA } from '../../data/mockData';

interface RightSidebarProps {
  members: GuildMember[];
  studyRoom: StudyRoom;
  onJoinStudyRoom: () => void;
  onOpenMentorHint: () => void;
  onOpenMentorChallenge: () => void;
  onMemberClick?: (member: GuildMember) => void;
  onCloseMobile?: () => void;
  isMobileDrawer?: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  members,
  studyRoom,
  onJoinStudyRoom,
  onOpenMentorHint,
  onOpenMentorChallenge,
  onMemberClick,
  onCloseMobile,
  isMobileDrawer = false
}) => {
  const [memberFilter, setMemberFilter] = useState('');
  const [seconds, setSeconds] = useState(studyRoom.initialTimeSeconds);
  const [isTimerRunning] = useState(true);

  // Live timer tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberFilter.toLowerCase()) ||
      m.roleClass.toLowerCase().includes(memberFilter.toLowerCase()) ||
      m.status.toLowerCase().includes(memberFilter.toLowerCase())
  );

  const getStatusBadge = (status: GuildMember['status']) => {
    switch (status) {
      case 'In a quest':
        return { text: 'In a quest', color: 'text-amber-300 bg-amber-950/60 border-amber-800/50' };
      case 'In Study Room':
        return { text: 'In Study Room', color: 'text-cyan-300 bg-cyan-950/60 border-cyan-800/50' };
      case 'In Guild Hall':
        return { text: 'In Guild Hall', color: 'text-blue-300 bg-blue-950/60 border-blue-800/50' };
      case 'In Boss Arena':
        return { text: 'In Boss Arena', color: 'text-rose-300 bg-rose-950/60 border-rose-800/50' };
      case 'Online':
        return { text: 'Online', color: 'text-emerald-300 bg-emerald-950/60 border-emerald-800/50' };
      default:
        return { text: 'Offline', color: 'text-slate-400 bg-slate-800/60 border-slate-700/50' };
    }
  };

  return (
    <aside
      className={`${
        isMobileDrawer
          ? 'w-80 max-w-[90vw] h-full flex flex-col bg-[#090f1d] border-l border-[#19243b] shadow-2xl z-40'
          : 'hidden xl:flex w-[330px] flex-shrink-0 bg-[#090f1d] border-l border-[#19243b] flex-col h-full select-none overflow-hidden'
      }`}
    >
      {/* 1. GUILD MEMBERS PANEL */}
      <div className="flex-1 min-h-0 flex flex-col border-b border-[#18233a]">
        <div className="p-3.5 border-b border-[#162136] bg-[#0c1322]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-semibold text-slate-100 tracking-wide">Guild Members</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold">
                12/24
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
              className="w-full bg-[#0a101d] border border-[#1b2844] rounded-inner pl-8 pr-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
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
                className="flex items-center justify-between p-2 rounded-inner hover:bg-[#111c33] border border-transparent hover:border-[#1d2c4b] transition-all cursor-pointer group"
                title={`Click to open ${member.name} actions`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    seed={member.avatarSeed}
                    size="sm"
                    showStatus
                    isOnline={member.isOnline}
                    statusColor={member.status === 'In Boss Arena' ? 'bg-rose-400' : 'bg-cyan-400'}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-200 truncate">
                        {member.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 px-1 py-0.2 rounded bg-slate-800 border border-slate-700/60">
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
      <div className="p-3.5 border-b border-[#18233a] bg-[#0c1424]">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar seed={MENTOR_ASTRA.name} size="md" showStatus isOnline statusColor="bg-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-cyan-300" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                {MENTOR_ASTRA.name}
              </h4>
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 bg-cyan-950/90 text-cyan-300 border border-cyan-800 rounded">
                {MENTOR_ASTRA.role}
              </span>
            </div>
            <p className="text-[10px] font-mono text-cyan-400/80 mt-0.5">{MENTOR_ASTRA.title}</p>
          </div>
        </div>

        {/* NPC Speech bubble */}
        <div className="mt-2.5 p-2.5 rounded-inner bg-[#101c33]/90 border border-[#1e2e4f] text-[11px] text-slate-300 leading-relaxed italic relative">
          {MENTOR_ASTRA.message}
        </div>

        {/* NPC Actions */}
        <div className="grid grid-cols-2 gap-2 mt-2.5">
          <button
            onClick={() => {
              onOpenMentorHint();
              if (isMobileDrawer && onCloseMobile) onCloseMobile();
            }}
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-inner bg-[#142340] hover:bg-[#1c325c] text-cyan-300 border border-cyan-700/40 text-[11px] font-semibold transition-all active:scale-[0.98]"
          >
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            <span>Give me a hint</span>
          </button>
          <button
            onClick={() => {
              onOpenMentorChallenge();
              if (isMobileDrawer && onCloseMobile) onCloseMobile();
            }}
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-inner bg-[#1b253b] hover:bg-[#253554] text-purple-300 border border-purple-700/40 text-[11px] font-semibold transition-all active:scale-[0.98]"
          >
            <Swords className="w-3.5 h-3.5 text-purple-400" />
            <span>Challenge me</span>
          </button>
        </div>
      </div>

      {/* 3. STUDY SANCTUARY CARD */}
      <div className="p-3.5 bg-[#0b1322]">
        <div className="p-3 rounded-card bg-[#0f1a30] border border-[#203254] shadow-panel">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Headphones className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">{studyRoom.name}</h4>
                <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Topic: {studyRoom.topic}</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {studyRoom.onlineCount}/{studyRoom.maxCapacity}
            </span>
          </div>

          {/* Members row & live waveform */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center -space-x-1.5">
              {studyRoom.activeMembers.map((m, idx) => (
                <div key={idx} className="ring-2 ring-[#0f1a30] rounded-full" title={m.name}>
                  <Avatar seed={m.avatarSeed} size="xs" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#09101e] border border-[#1b2842]">
              <div className="flex items-end gap-0.5 h-4 w-7">
                <span className="w-1 bg-cyan-400 rounded-full wave-bar-1" />
                <span className="w-1 bg-cyan-300 rounded-full wave-bar-2" />
                <span className="w-1 bg-teal-400 rounded-full wave-bar-3" />
                <span className="w-1 bg-cyan-500 rounded-full wave-bar-4" />
              </div>
              <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                {formatTimer(seconds)}
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              onJoinStudyRoom();
              if (isMobileDrawer && onCloseMobile) onCloseMobile();
            }}
            className="w-full mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-inner bg-cyan-500 hover:bg-cyan-400 text-[#070b13] font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98]"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Join Room</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
