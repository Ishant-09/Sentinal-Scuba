import React, { useState, useEffect } from 'react';
import { Headphones, Volume2, Mic, MicOff, Users, Play, Pause, RotateCcw, MessageSquare, Send, Sparkles } from 'lucide-react';
import { StudyRoom, UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';

interface StudyRoomsViewProps {
  studyRoom: StudyRoom;
  user: UserProfile;
}

export const StudyRoomsView: React.FC<StudyRoomsViewProps> = ({ studyRoom, user }) => {
  const [timerSeconds, setTimerSeconds] = useState(25 * 60); // 25 min default pomodoro
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [ambientSound, setAmbientSound] = useState<'lofi' | 'rain' | 'whitenoise' | 'none'>('lofi');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; seed: string }>>([
    { sender: 'Akira', text: 'Currently working through outer join edge cases in LeetCode #185.', time: '19:15', seed: 'akira' },
    { sender: 'Kai', text: 'Remember to test against empty table partitions!', time: '19:18', seed: 'kai' },
    { sender: 'Mika', text: 'Party XP boost is active (+15%). Keep it going!', time: '19:20', seed: 'mika' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        sender: user.name,
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seed: user.avatarSeed
      }
    ]);
    setNewMessage('');
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1c2944]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{studyRoom.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                ● Live Voice Session
              </span>
            </div>
            <p className="text-xs text-slate-400">Collaborative deep-focus study chamber for SQL mastery</p>
          </div>
        </div>

        {/* Ambient controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-inner text-xs font-semibold border transition-all ${
              isMuted
                ? 'bg-[#1a1c29] text-rose-300 border-rose-800/60'
                : 'bg-cyan-950 text-cyan-300 border-cyan-800'
            }`}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isMuted ? 'Muted' : 'Speaking'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Pomodoro & Members, Right Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Focus Room (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Pomodoro Timer Center */}
          <div className="rounded-card bg-[#0e172d] border border-[#1e2d4d] p-6 text-center shadow-panel">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Focus Session Timer
            </span>
            <div className="text-5xl font-mono font-black text-white tracking-widest my-4">
              {formatTime(timerSeconds)}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex items-center gap-2 px-5 py-2 rounded-inner bg-cyan-500 hover:bg-cyan-400 text-[#070b13] font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98]"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
              </button>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setTimerSeconds(25 * 60);
                }}
                className="p-2 rounded-inner bg-[#14213d] hover:bg-[#1a2d54] text-slate-400 hover:text-white border border-[#23355b] transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-[#18243e] flex items-center justify-center gap-2 text-xs text-slate-400">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ambient Sound:</span>
              {(['lofi', 'rain', 'whitenoise', 'none'] as const).map((amb) => (
                <button
                  key={amb}
                  onClick={() => setAmbientSound(amb)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                    ambientSound === amb ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'hover:text-white'
                  }`}
                >
                  {amb}
                </button>
              ))}
            </div>
          </div>

          {/* Active Participants in Room */}
          <div className="rounded-card bg-[#0e162b] border border-[#1d2b4a] p-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#18233c] mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Active Party Members (4/6)
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> +15% Party Aura
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {studyRoom.activeMembers.map((m, i) => (
                <div key={i} className="p-3 rounded-inner bg-[#111c33] border border-[#1e2f52] flex flex-col items-center text-center">
                  <Avatar seed={m.avatarSeed} size="md" showStatus isOnline statusColor="bg-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200 mt-2">{m.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400 mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Listening
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Shared Notes & Study Chat (5 cols) */}
        <div className="lg:col-span-5 rounded-card bg-[#0b1222] border border-[#192640] p-4 flex flex-col h-[520px]">
          <div className="pb-3 border-b border-[#18233a] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Study Room Scratchpad & Chat
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
            {chatMessages.map((msg, i) => (
              <div key={i} className="p-2.5 rounded-inner bg-[#0f172a] border border-[#1b2842] text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-cyan-300">{msg.sender}</span>
                  <span className="text-[10px] font-mono text-slate-500">{msg.time}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="pt-3 border-t border-[#18233a] flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share a SQL note or tip..."
              className="flex-1 bg-[#090f1d] border border-[#1a2842] rounded-inner px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="p-2 rounded-inner bg-cyan-500 hover:bg-cyan-400 text-[#070b13] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
