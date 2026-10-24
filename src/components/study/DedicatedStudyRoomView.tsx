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
  PhoneOff,
  UserPlus,
  Copy,
  Check,
  X
} from 'lucide-react';
import { StudyRoom, UserProfile, GuildMember, StudyRoomTab } from '../../types';
import { Avatar } from '../common/Avatar';
import { FocusChamberView } from './FocusChamberView';
import { ScreenShareView } from './ScreenShareView';
import { Whiteboard } from './Whiteboard';
import { MiniGamesView } from './MiniGamesView';
import { RoomNotesChat } from './RoomNotesChat';
import { useSocket } from '../../realtime/socket';
import { api } from '../../api/client';

interface DedicatedStudyRoomViewProps {
  studyRoom: StudyRoom;
  user: UserProfile;
  members?: GuildMember[];
  onLeaveRoom: () => void;
  onEndChamber?: () => void;
  onRewardXp?: (amount: number, reason: string) => void;
  isStandaloneTab?: boolean;
}

export const DedicatedStudyRoomView: React.FC<DedicatedStudyRoomViewProps> = ({
  studyRoom,
  user,
  members = [],
  onLeaveRoom,
  onEndChamber,
  onRewardXp,
  isStandaloneTab = false
}) => {
  const { emit } = useSocket();
  const [currentTab, setCurrentTab] = useState<StudyRoomTab>('focus');
  const [isMuted, setIsMuted] = useState(true);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const roomShareUrl = `${window.location.origin}/?room=${studyRoom.id}`;

  const handleOpenInNewTab = () => {
    window.open(roomShareUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleInviteFriend = async (friend: GuildMember) => {
    if (invitedFriends.includes(friend.name)) return;
    setInvitedFriends((prev) => [...prev, friend.name]);

    // 1. Emit live notification over Socket.IO to friend's device
    if (emit) {
      emit('notification:send', {
        id: `notif-invite-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'study',
        title: 'Study Sanctuary Invite',
        desc: `${user.name} invited you to join "${studyRoom.name}" (${studyRoom.topic})!`,
        timestamp: 'Just now',
        unread: true,
        actionUrl: `?room=${studyRoom.id}`,
        roomId: studyRoom.id,
        roomName: studyRoom.name
      });
    }

    // 2. Persist invite via backend API
    try {
      await api.studyRooms.inviteFriends(studyRoom.id, [friend.name], user.name);
    } catch {}
  };

  const availableFriends = members.filter((m) => m.name !== user.name);

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

          {/* Invite Friends Button */}
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-inner bg-teal-950/80 hover:bg-teal-900 border border-teal-500/50 hover:border-teal-400 text-teal-300 text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Invite party friends to this chamber"
          >
            <UserPlus className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Invite Friends</span>
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

      {/* Invite Friends Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0d121e] border border-[#1b2538] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
              <div>
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-teal-400" />
                  Invite Friends to Chamber
                </span>
                <p className="text-[11px] text-teal-400/90 font-mono mt-0.5">{studyRoom.name}</p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono p-1"
              >
                ✕
              </button>
            </div>

            {/* Direct Link Section */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Direct Chamber Link
              </label>
              <div className="p-2 rounded-inner bg-[#090d16] border border-[#1b2538] flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-teal-300 truncate">{roomShareUrl}</span>
                <button
                  onClick={handleCopyLink}
                  className="px-2 py-1 rounded bg-[#131b2c] hover:bg-[#1a253c] border border-[#1f2d44] text-[10px] font-semibold text-teal-300 flex items-center gap-1 flex-shrink-0"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-teal-400" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Friends / Party Members List */}
            <div>
              <label className="block text-xs font-bold text-white mb-2">
                Party Scholars ({availableFriends.length})
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto p-1 bg-[#090d16] rounded-inner border border-[#172235]">
                {availableFriends.map((friend) => {
                  const isInvited = invitedFriends.includes(friend.name);
                  return (
                    <div
                      key={friend.id}
                      className="p-2 rounded-inner bg-[#101624] border border-[#1b2538] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar seed={friend.avatarSeed} size="xs" />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-200 block truncate leading-tight">
                            {friend.name}
                          </span>
                          <span className="text-[10px] text-teal-400 font-mono block truncate">
                            {friend.roleClass} • Level {friend.level}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleInviteFriend(friend)}
                        disabled={isInvited}
                        className={`px-3 py-1 rounded-inner text-[11px] font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
                          isInvited
                            ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300 cursor-default'
                            : 'bg-teal-500 hover:bg-teal-400 text-[#070b13] shadow-sm active:scale-95'
                        }`}
                      >
                        {isInvited ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Invited</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3" />
                            <span>Invite</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#182030]">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-1.5 rounded-inner bg-[#121824] hover:bg-[#1a2333] border border-[#1b2538] text-slate-300 hover:text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

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
            <Whiteboard
              roomId={studyRoom.id}
              roomTopic={studyRoom.topic}
              userName={user.name}
            />
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
