import React, { useState } from 'react';
import {
  Headphones,
  Monitor,
  PenTool,
  Gamepad2,
  FileText,
  ExternalLink,
  ArrowLeft,
  Users,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  LogOut,
  PhoneOff
} from 'lucide-react';
import { StudyRoom, UserProfile, StudyRoomTab } from '../../types';
import { FocusChamberView } from './FocusChamberView';
import { ScreenShareView } from './ScreenShareView';
import { Whiteboard } from './Whiteboard';
import { MiniGamesView } from './MiniGamesView';
import { RoomNotesChat } from './RoomNotesChat';

interface DedicatedStudyRoomViewProps {
  studyRoom: StudyRoom;
  user: UserProfile;
  onLeaveRoom: () => void;
  onEndChamber?: () => void;
  onRewardXp?: (amount: number, reason: string) => void;
  isStandaloneTab?: boolean;
}

export const DedicatedStudyRoomView: React.FC<DedicatedStudyRoomViewProps> = ({
  studyRoom,
  user,
  onLeaveRoom,
  onEndChamber,
  onRewardXp,
  isStandaloneTab = false
}) => {
  const [currentTab, setCurrentTab] = useState<StudyRoomTab>('focus');
  const [isMuted, setIsMuted] = useState(true);
  const [isDeafened, setIsDeafened] = useState(false);

  const handleOpenInNewTab = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${studyRoom.id}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#070b13] text-slate-200 select-none overflow-hidden">
      {/* =========================================================================
          DEDICATED STUDY ROOM INDEPENDENT NAVIGATION BAR
          ========================================================================= */}
      <nav className="h-14 bg-[#0a0e17] border-b border-[#182030] px-3 sm:px-5 flex items-center justify-between flex-shrink-0 z-30 w-full overflow-x-auto">
        {/* Left: Back / Exit & Room Info */}
        <div className="flex items-center gap-3 min-w-max">
          <button
            onClick={onLeaveRoom}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-inner bg-[#121824] hover:bg-[#192335] border border-[#1b2538] text-xs text-slate-300 hover:text-white transition-colors group"
            title="Return to Study Chambers Directory"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Chambers Hub</span>
          </button>

          <div className="h-4 w-[1px] bg-[#1a2538] hidden sm:block" />

          {/* Room Title & Status */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-950 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs sm:text-sm tracking-tight truncate max-w-[160px] sm:max-w-xs">
                  {studyRoom.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-teal-400/90 truncate max-w-[200px] sm:max-w-md hidden md:block">
                Topic: {studyRoom.topic}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Dedicated Study Room Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#101524] p-1 rounded-inner border border-[#1a2335] mx-2">
          <button
            onClick={() => setCurrentTab('focus')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded text-xs transition-colors ${
              currentTab === 'focus'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Focus Chamber</span>
            <span className="md:hidden">Focus</span>
          </button>

          <button
            onClick={() => setCurrentTab('screenshare')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded text-xs transition-colors ${
              currentTab === 'screenshare'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Screen Share</span>
            <span className="md:hidden">Screen</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline" />
          </button>

          <button
            onClick={() => setCurrentTab('whiteboard')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded text-xs transition-colors ${
              currentTab === 'whiteboard'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Whiteboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('games')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded text-xs transition-colors ${
              currentTab === 'games'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Break Mini-Games</span>
            <span className="md:hidden">Games</span>
            <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300 font-mono hidden sm:inline">
              XP
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('notes')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded text-xs transition-colors ${
              currentTab === 'notes'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Notes & Chat</span>
            <span className="md:hidden">Notes</span>
          </button>
        </div>

        {/* Right: Audio Controls & Open in New Tab Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          {/* Mic Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 sm:px-2 sm:py-1 rounded-inner text-xs flex items-center gap-1 border transition-colors ${
              isMuted
                ? 'bg-[#121824] border-[#1b2538] text-slate-400 hover:text-white'
                : 'bg-teal-950 border-teal-500/60 text-teal-300 font-semibold'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-teal-400" />}
            <span className="hidden lg:inline">{isMuted ? 'Muted' : 'Speaking'}</span>
          </button>

          {/* Deafen Toggle */}
          <button
            onClick={() => setIsDeafened(!isDeafened)}
            className={`p-1.5 sm:px-2 sm:py-1 rounded-inner text-xs flex items-center gap-1 border transition-colors ${
              isDeafened
                ? 'bg-rose-950/70 border-rose-500/60 text-rose-300'
                : 'bg-[#121824] border-[#1b2538] text-slate-400 hover:text-white'
            }`}
            title={isDeafened ? 'Undeafen Audio' : 'Deafen Chamber Audio'}
          >
            {isDeafened ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Open in Separate Browser Tab button */}
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-inner bg-[#121824] hover:bg-[#192335] border border-teal-500/40 hover:border-teal-400 text-teal-300 text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Open this Study Room in a separate browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Open in New Tab</span>
          </button>

          {/* Leave Room Button */}
          <button
            onClick={onLeaveRoom}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-inner bg-[#121824] hover:bg-[#182030] border border-[#1b2538] text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
            title="Leave room (keeps chamber open for others)"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Leave</span>
          </button>

          {/* End Chamber Button (Ends call for everyone & removes from directory) */}
          <button
            onClick={onEndChamber}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-inner bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="End chamber session for everyone and remove from virtual rooms"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Chamber</span>
          </button>
        </div>
      </nav>

      {/* =========================================================================
          MAIN STUDY ROOM VIEWPORT
          ========================================================================= */}
      <div className="flex-1 overflow-hidden p-3 sm:p-5 bg-[#070b13]">
        {currentTab === 'focus' && (
          <div className="h-full overflow-y-auto">
            <FocusChamberView studyRoom={studyRoom} user={user} onRewardXp={onRewardXp} />
          </div>
        )}

        {currentTab === 'screenshare' && (
          <div className="h-full">
            <ScreenShareView currentUserName={user.name} roomTopic={studyRoom.topic} />
          </div>
        )}

        {currentTab === 'whiteboard' && (
          <div className="h-full">
            <Whiteboard roomTopic={studyRoom.topic} />
          </div>
        )}

        {currentTab === 'games' && (
          <div className="h-full">
            <MiniGamesView onRewardXp={onRewardXp} />
          </div>
        )}

        {currentTab === 'notes' && (
          <div className="h-full">
            <RoomNotesChat user={user} roomTopic={studyRoom.topic} />
          </div>
        )}
      </div>
    </div>
  );
};
