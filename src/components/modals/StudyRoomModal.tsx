import React, { useState } from 'react';
import { X, Headphones, Mic, MicOff, Volume2, Radio, Sparkles, PhoneOff } from 'lucide-react';
import { StudyRoom, UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';

interface StudyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyRoom: StudyRoom;
  user: UserProfile;
}

export const StudyRoomModal: React.FC<StudyRoomModalProps> = ({
  isOpen,
  onClose,
  studyRoom,
  user
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0d1629] border border-[#203254] rounded-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1b2a47] bg-[#0c1424]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{studyRoom.name}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] font-mono text-cyan-400">Active Topic: {studyRoom.topic}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="p-3 rounded-inner bg-[#10192e] border border-[#1d2b4a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">Party Focus Aura</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
              +15% Study XP Active
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Voice Channel Adventurers ({studyRoom.activeMembers.length}/6)
            </span>
            <div className="space-y-2">
              {studyRoom.activeMembers.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-inner bg-[#111c34] border border-[#1e2f54]"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar seed={m.avatarSeed} size="sm" showStatus isOnline statusColor="bg-cyan-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-200">{m.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">Connected</span>
                    </div>
                  </div>

                  {/* Waveform indicator */}
                  <div className="flex items-center gap-1 h-3">
                    <span className="w-1 bg-cyan-400 rounded-full h-full animate-subtle-pulse" />
                    <span className="w-1 bg-cyan-300 rounded-full h-2/3" />
                    <span className="w-1 bg-teal-400 rounded-full h-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Controls */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full border transition-all ${
                isMuted
                  ? 'bg-rose-950 border-rose-800 text-rose-300'
                  : 'bg-[#152340] border-[#223661] text-cyan-300 hover:bg-[#1a2d54]'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsDeafened(!isDeafened)}
              className={`p-3 rounded-full border transition-all ${
                isDeafened
                  ? 'bg-rose-950 border-rose-800 text-rose-300'
                  : 'bg-[#152340] border-[#223661] text-cyan-300 hover:bg-[#1a2d54]'
              }`}
              title={isDeafened ? 'Undeafen' : 'Deafen'}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-inner bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Leave Room</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
