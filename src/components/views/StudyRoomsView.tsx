import React, { useState } from 'react';
import {
  Headphones,
  Users,
  ExternalLink,
  Plus,
  Radio,
  Monitor,
  PenTool,
  Gamepad2,
  Sparkles,
  ArrowRight,
  Shield,
  Search,
  CheckCircle2,
  Clock,
  PhoneOff,
  UserPlus,
  Copy,
  Check
} from 'lucide-react';
import { StudyRoom, UserProfile, GuildMember } from '../../types';
import { Avatar } from '../common/Avatar';
import { DedicatedStudyRoomView } from '../study/DedicatedStudyRoomView';

interface StudyRoomsViewProps {
  rooms: StudyRoom[];
  user: UserProfile;
  members?: GuildMember[];
  activeRoomId?: string | null;
  onSelectRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  onEndChamber?: (roomId: string) => void;
  onOpenStudyChat?: () => void;
  onRewardXp?: (amount: number, reason: string) => void;
  onCreateRoom?: (newRoom: StudyRoom, invitedFriends?: string[]) => void;
}

export const StudyRoomsView: React.FC<StudyRoomsViewProps> = ({
  rooms,
  user,
  members = [],
  activeRoomId,
  onSelectRoom,
  onLeaveRoom,
  onEndChamber,
  onOpenStudyChat,
  onRewardXp,
  onCreateRoom
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomTopic, setNewRoomTopic] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState(6);
  const [selectedInvites, setSelectedInvites] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [pendingRoomId, setPendingRoomId] = useState<string>(() => `room-${Date.now().toString(36)}`);

  // If a room is currently active, render the dedicated room view with its own navigation
  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  if (activeRoom) {
    return (
      <DedicatedStudyRoomView
        studyRoom={activeRoom}
        user={user}
        members={members}
        onLeaveRoom={onLeaveRoom}
        onEndChamber={() => onEndChamber?.(activeRoom.id)}
        onRewardXp={onRewardXp}
      />
    );
  }

  const handleOpenInNewTab = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    window.open(url, '_blank');
  };

  const handleOpenCreateModal = () => {
    const nextId = `room-${Date.now().toString(36)}`;
    setPendingRoomId(nextId);
    // Pre-select other guild members by default for convenience
    const otherMembers = members.filter((m) => m.name !== user.name).map((m) => m.name);
    setSelectedInvites(otherMembers);
    setIsCreating(true);
  };

  const toggleFriendInvite = (name: string) => {
    setSelectedInvites((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSelectAllFriends = () => {
    const otherMembers = members.filter((m) => m.name !== user.name).map((m) => m.name);
    if (selectedInvites.length === otherMembers.length) {
      setSelectedInvites([]);
    } else {
      setSelectedInvites(otherMembers);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !newRoomTopic.trim()) return;

    const roomId = pendingRoomId;
    const newChamber: StudyRoom = {
      id: roomId,
      name: newRoomName.trim(),
      topic: newRoomTopic.trim(),
      onlineCount: 1,
      maxCapacity: newRoomCapacity,
      initialTimeSeconds: 25 * 60,
      tag: 'Custom',
      description: `Collaborative focus chamber dedicated to ${newRoomTopic.trim()}.`,
      isScreenSharing: false,
      activeMembers: [{ name: user.name, avatarSeed: user.avatarSeed, avatarColor: '#14b8a6' }],
      isLive: true
    };

    onCreateRoom?.(newChamber, selectedInvites);
    setIsCreating(false);
    setNewRoomName('');
    setNewRoomTopic('');
    setSelectedInvites([]);
    onSelectRoom(newChamber.id);
  };

  const filteredRooms = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.topic.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (r.tag && r.tag.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const availableFriends = members.filter((m) => m.name !== user.name);

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Top Header Directory Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#182030]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-sm">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Study Chambers & Virtual Rooms</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-semibold">
                  Live Rooms
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Join an active collaborative session, screen share code, sketch on whiteboards, and play breaktime mini-games.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Create Chamber & Search */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-inner bg-teal-500 hover:bg-teal-400 text-[#070b13] font-bold text-xs transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Chamber</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d121e] border border-[#1a2333] p-3 rounded-card">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-[#111724] border border-[#1b2538] rounded-inner px-3 py-1.5 text-xs text-slate-200">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search by topic, algorithms, SQL, Python..."
            className="w-full bg-transparent border-none focus:outline-none placeholder-slate-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>{rooms.length} Active Chambers</span>
          <span>•</span>
          <span className="text-teal-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            {rooms.reduce((acc, r) => acc + r.onlineCount, 0)} Adventurers Online
          </span>
        </div>
      </div>

      {/* Create Chamber Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0d121e] border border-[#1b2538] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" />
                Found New Study Chamber
              </span>
              <button
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Chamber Name</label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. Neural Networks & LeetCode Sprint"
                  className="w-full bg-[#111724] border border-[#1b2538] focus:border-teal-500 rounded-inner px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Curriculum Topic</label>
                <input
                  type="text"
                  required
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  placeholder="e.g. Python AsyncIO & Event Loops"
                  className="w-full bg-[#111724] border border-[#1b2538] focus:border-teal-500 rounded-inner px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Party Capacity</label>
                <select
                  value={newRoomCapacity}
                  onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                  className="w-full bg-[#111724] border border-[#1b2538] focus:border-teal-500 rounded-inner px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value={4}>4 Adventurers (Intimate Focus)</option>
                  <option value={6}>6 Adventurers (Standard Party)</option>
                  <option value={8}>8 Adventurers (Raid Study)</option>
                </select>
              </div>

              {/* Invite Friends / Party Members Section */}
              <div className="pt-2 border-t border-[#182030]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-teal-400" />
                    <label className="text-xs font-bold text-white">Invite Friends to Chamber</label>
                  </div>
                  {availableFriends.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAllFriends}
                      className="text-[10px] font-mono text-teal-400 hover:text-teal-300"
                    >
                      {selectedInvites.length === availableFriends.length ? 'Clear All' : 'Select All'}
                    </button>
                  )}
                </div>

                {availableFriends.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 bg-[#090d16] rounded-inner border border-[#172235]">
                    {availableFriends.map((friend) => {
                      const isSelected = selectedInvites.includes(friend.name);
                      return (
                        <div
                          key={friend.id}
                          onClick={() => toggleFriendInvite(friend.name)}
                          className={`p-2 rounded-inner border cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-teal-950/50 border-teal-500/70 text-white'
                              : 'bg-[#101624] border-[#1b2538] text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar seed={friend.avatarSeed} size="xs" />
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-slate-200 block truncate leading-tight">
                                {friend.name}
                              </span>
                              <span className="text-[10px] text-teal-400 font-mono block truncate">
                                {friend.roleClass}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0 ml-1 ${
                              isSelected
                                ? 'bg-teal-500 border-teal-400 text-[#070b13] font-bold'
                                : 'border-slate-600'
                            }`}
                          >
                            {isSelected && '✓'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">All party members are in your party.</p>
                )}

                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  {selectedInvites.length > 0
                    ? `⚡ ${selectedInvites.length} scholar${selectedInvites.length > 1 ? 's' : ''} will receive an instant join invite.`
                    : 'No friends selected. You can also share the direct link below.'}
                </p>
              </div>

              {/* Direct Shareable Chamber Link Preview */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Shareable Chamber URL (Direct Join)
                </label>
                <div className="p-2 rounded-inner bg-[#090d16] border border-[#1b2538] flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-teal-300 truncate">
                    {window.location.origin}/?room={pendingRoomId}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/?room=${pendingRoomId}`);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-2 py-1 rounded bg-[#131b2c] hover:bg-[#1a253c] border border-[#1f2d44] text-[10px] font-semibold text-teal-300 flex items-center gap-1 flex-shrink-0"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-teal-400" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#182030]">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-inner border border-[#1b2538] text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-inner bg-teal-500 hover:bg-teal-400 text-[#070b13] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    Open Chamber {selectedInvites.length > 0 ? `& Invite (${selectedInvites.length})` : ''}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Study Chambers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRooms.map((room) => {
          return (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className="group rounded-card bg-[#0e131d] border border-[#1a2333] hover:border-teal-500/50 p-5 shadow-panel transition-all hover:bg-[#111824] cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#141d2d] border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:border-teal-400 transition-colors">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                          {room.name}
                        </h3>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <span className="text-[11px] font-mono text-teal-400">{room.topic}</span>
                    </div>
                  </div>

                  {/* Chamber Action Buttons: End Chamber & Open in Separate Tab */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`End chamber "${room.name}"? This closes the session for everyone and removes it from active virtual rooms.`)) {
                          onEndChamber?.(room.id);
                        }
                      }}
                      className="p-1.5 rounded-inner bg-[#141d2d] hover:bg-rose-950/70 border border-[#1e2c44] hover:border-rose-500/50 text-slate-400 hover:text-rose-300 transition-colors flex items-center gap-1 text-xs"
                      title="End Chamber for everyone & remove from virtual rooms"
                    >
                      <PhoneOff className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-[10px] hidden sm:inline">End Chamber</span>
                    </button>

                    <button
                      onClick={(e) => handleOpenInNewTab(e, room.id)}
                      className="p-1.5 rounded-inner bg-[#141d2d] hover:bg-[#1c2940] border border-[#1e2c44] text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 text-xs"
                      title="Open this room in a separate browser tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="text-[10px] hidden sm:inline">New Tab</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">
                  {room.description || 'Live quiet study sanctuary with pomodoro focus and collaborative scratchpad.'}
                </p>

                {/* Feature Tags Strip */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131b2c] border border-[#1f2d44] text-teal-300 flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-teal-400" /> Screen Share
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131b2c] border border-[#1f2d44] text-cyan-300 flex items-center gap-1">
                    <PenTool className="w-3 h-3 text-cyan-400" /> Whiteboard
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131b2c] border border-[#1f2d44] text-amber-300 flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3 text-amber-400" /> Mini-Games
                  </span>
                </div>
              </div>

              {/* Bottom Participant Avatars & Enter Button */}
              <div className="pt-3 border-t border-[#161f2e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {room.activeMembers.map((m, i) => (
                      <div key={i} className="ring-2 ring-[#0e131d] rounded-full">
                        <Avatar seed={m.avatarSeed} size="xs" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {room.onlineCount}/{room.maxCapacity} Online
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300 group-hover:translate-x-1 transition-all">
                  <span>Enter Chamber</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
