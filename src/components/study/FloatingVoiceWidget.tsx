import React, { useState, useEffect } from 'react';
import {
  Headphones,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Radio,
  Users,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { StudyRoom } from '../../types';
import { Avatar } from '../common/Avatar';

interface FloatingVoiceWidgetProps {
  room: StudyRoom;
  onLeaveRoom: () => void;
  onExpandChamber?: () => void;
  currentUserName: string;
}

export const FloatingVoiceWidget: React.FC<FloatingVoiceWidgetProps> = ({
  room,
  onLeaveRoom,
  onExpandChamber,
  currentUserName
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [seconds, setSeconds] = useState(room.initialTimeSeconds || 18 * 60 + 42);

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <div
      className="fixed bottom-5 right-5 sm:right-6 z-40 select-none animate-in fade-in slide-in-from-bottom-5 duration-200"
      style={{ filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.6))' }}
    >
      {isMinimized ? (
        /* Minimized Pill Mode */
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-[#0c111c] border border-teal-500/50 shadow-2xl backdrop-blur-md text-xs text-white">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-teal-300 font-mono text-[11px]">{formatTimer(seconds)}</span>
          </div>

          <span className="text-slate-400">|</span>

          <span className="font-bold text-[11px] text-slate-200 truncate max-w-[100px]">{room.name}</span>

          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-teal-400" />}
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
              title="Expand Voice Widget"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onLeaveRoom}
              className="p-1 rounded-full bg-rose-600/80 hover:bg-rose-500 text-white ml-0.5"
              title="Leave Room"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Full Expanded Voice Window */
        <div className="w-80 max-w-[calc(100vw-2.5rem)] rounded-card bg-[#0d121e] border border-teal-500/40 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Top Status Header */}
          <div className="bg-[#0f1626] border-b border-[#1b2538] px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="leading-tight">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-300 block">
                  VOICE CONNECTED
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <span>RTC 16ms</span>
                  <span>•</span>
                  <span>Opus 64kbps</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onExpandChamber && (
                <button
                  onClick={onExpandChamber}
                  className="p-1 rounded text-slate-400 hover:text-teal-300 transition-colors"
                  title="Open Fullscreen Chamber"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                title="Minimize Widget"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chamber Body Info */}
          <div className="p-3.5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-bold text-white tracking-tight leading-snug">{room.name}</h4>
                <p className="text-[11px] text-teal-400 font-mono truncate max-w-[190px]">
                  Topic: {room.topic}
                </p>
              </div>

              {/* Live Waveform Timer */}
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#111724] border border-[#1b2538]">
                <div className="flex items-end gap-0.5 h-3 w-5">
                  <span className="w-0.5 bg-teal-400 rounded-full wave-bar-1" />
                  <span className="w-0.5 bg-teal-300 rounded-full wave-bar-2" />
                  <span className="w-0.5 bg-teal-500 rounded-full wave-bar-3" />
                  <span className="w-0.5 bg-teal-400 rounded-full wave-bar-4" />
                </div>
                <span className="text-[10px] font-mono text-teal-300 font-semibold">
                  {formatTimer(seconds)}
                </span>
              </div>
            </div>

            {/* Active Members Avatars & Pulse */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center -space-x-1.5">
                {room.activeMembers.map((m, idx) => (
                  <div
                    key={idx}
                    className="ring-2 ring-[#0d121e] rounded-full relative group/avatar cursor-pointer"
                    title={m.name}
                  >
                    <Avatar seed={m.avatarSeed} size="xs" />
                  </div>
                ))}
              </div>

              <span className="text-[10px] font-mono text-slate-400">
                {room.activeMembers.length} Adventurers Talking
              </span>
            </div>

            {/* Audio & Room Control Action Buttons */}
            <div className="pt-2 border-t border-[#182030] grid grid-cols-4 gap-1.5">
              {/* Mic Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`py-1.5 rounded-inner text-xs font-semibold flex items-center justify-center gap-1 border transition-colors ${
                  isMuted
                    ? 'bg-rose-950/60 border-rose-800/80 text-rose-300'
                    : 'bg-[#121929] border-[#1b2538] text-slate-300 hover:text-white'
                }`}
                title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-teal-400" />}
              </button>

              {/* Deafen Toggle */}
              <button
                onClick={() => setIsDeafened(!isDeafened)}
                className={`py-1.5 rounded-inner text-xs font-semibold flex items-center justify-center gap-1 border transition-colors ${
                  isDeafened
                    ? 'bg-rose-950/60 border-rose-800/80 text-rose-300'
                    : 'bg-[#121929] border-[#1b2538] text-slate-300 hover:text-white'
                }`}
                title={isDeafened ? 'Undeafen' : 'Deafen'}
              >
                {isDeafened ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              {/* Leave Room Button */}
              <button
                onClick={onLeaveRoom}
                className="col-span-2 py-1.5 px-3 rounded-inner bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-95"
                title="Disconnect from voice room"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Leave Room</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
