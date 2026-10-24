import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Radio,
  Sliders,
  Sparkles,
  Flame,
  CheckCircle2,
  Headphones,
  Coffee,
  Clock
} from 'lucide-react';
import { StudyRoom, UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import confetti from 'canvas-confetti';

export const FocusChamberView: React.FC<{
  studyRoom: StudyRoom;
  user: UserProfile;
  onRewardXp?: (amt: number, r: string) => void;
}> = ({ studyRoom, user, onRewardXp }) => {
  const [sessionMode, setSessionMode] = useState<25 | 50 | 15>(25);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [ambientSound, setAmbientSound] = useState<'lofi' | 'rain' | 'whitenoise' | 'none'>('lofi');
  const [ambientVolume, setAmbientVolume] = useState(50);
  const [personalGoal, setPersonalGoal] = useState('Solve 3 SQL join query plans & profile execution time');

  // Audio Context Ref for synthetic ambient sounds
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isRunning) {
      setIsRunning(false);
      confetti({ particleCount: 120, spread: 80 });
      onRewardXp?.(150, `Completing a ${sessionMode}-minute deep focus study block`);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds, sessionMode]);

  // Audio synthesis for ambient soundscapes
  useEffect(() => {
    if (ambientSound === 'none') {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Generate soft filtered ambient noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise / Rain approximation
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = ambientSound === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = ambientSound === 'rain' ? 600 : 420;

      const gain = ctx.createGain();
      gain.gain.value = (ambientVolume / 100) * 0.08;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(0);
      noiseNodeRef.current = noise;

      return () => {
        try {
          noise.stop();
          noise.disconnect();
        } catch {
          // ignore
        }
      };
    } catch {
      // Audio autoplay policy fallback
    }
  }, [ambientSound, ambientVolume]);

  const handleSelectMode = (mins: 25 | 50 | 15) => {
    setSessionMode(mins);
    setIsRunning(false);
    setTimerSeconds(mins * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalModeSeconds = sessionMode * 60;
  const progressPercent = Math.round(((totalModeSeconds - timerSeconds) / totalModeSeconds) * 100);

  // Participant task statuses
  const participantStatuses: Record<string, string> = {
    'Aviral Maurya': 'Optimizing Hash Join cost algorithms in Python',
    'Ishant Phadatare': 'Building schema index benchmarks',
    'Eknaath Bawane': 'Solving Phase 2 Query Devourer trial',
    'Ajay Gurjar': 'Reviewing Git merge conflict resolutions'
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Interactive Pomodoro & Goal Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Timer Card (7 cols) */}
        <div className="lg:col-span-7 rounded-card bg-[#0e131d] border border-[#1a2333] p-5 shadow-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                Focus Interval Engine
              </span>
              <div className="flex items-center gap-1 bg-[#121824] p-0.5 rounded-inner border border-[#1b2538]">
                {[25, 50, 15].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSelectMode(mins as any)}
                    className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                      sessionMode === mins
                        ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mins}m {mins === 15 ? '(Break)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Large Clock Display */}
            <div className="my-6 text-center">
              <div className="text-6xl sm:text-7xl font-mono font-bold tracking-tight text-white drop-shadow-[0_0_25px_rgba(20,184,166,0.2)]">
                {formatTime(timerSeconds)}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                {isRunning ? 'Deep focus flow in progress • Distraction shield active' : 'Session paused • Ready to resume'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#121824] h-2 rounded-full overflow-hidden border border-[#1b2538] mb-5">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-inner bg-teal-500 hover:bg-teal-400 text-[#070b13] font-bold text-xs tracking-wide transition-all shadow-md active:scale-95"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Pause Flow' : 'Begin Focus Session'}</span>
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setTimerSeconds(sessionMode * 60);
              }}
              className="p-2.5 rounded-inner bg-[#121824] hover:bg-[#1a2333] border border-[#1b2538] text-slate-400 hover:text-white transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient Lo-Fi & Focus Goal (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Ambient Sound Card */}
          <div className="rounded-card bg-[#0e131d] border border-[#1a2333] p-4 shadow-panel space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#182030]">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-teal-400" />
                Ambient Soundscape
              </span>
              <span className="text-[10px] font-mono text-teal-400 font-semibold">WebAudio Synthesizer</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'lofi', label: 'Lo-Fi Beats', icon: '🎧' },
                { id: 'rain', label: 'Midnight Rain', icon: '🌧️' },
                { id: 'whitenoise', label: 'Binaural Waves', icon: '🌊' },
                { id: 'none', label: 'Muted', icon: '🔇' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setAmbientSound(s.id as any)}
                  className={`p-2 rounded-inner border flex items-center gap-2 transition-all ${
                    ambientSound === s.id
                      ? 'bg-teal-950/70 border-teal-500/70 text-teal-200 font-semibold'
                      : 'bg-[#121824] border-[#1b2538] text-slate-400 hover:text-white hover:bg-[#151d2c]'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Volume Slider */}
            {ambientSound !== 'none' && (
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer h-1.5 bg-[#121824] rounded"
                />
                <span className="font-mono text-[11px] w-8">{ambientVolume}%</span>
              </div>
            )}
          </div>

          {/* Personal Session Objective */}
          <div className="rounded-card bg-[#0e131d] border border-[#1a2333] p-4 shadow-panel space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Chamber Focus Commitment
            </span>
            <input
              type="text"
              value={personalGoal}
              onChange={(e) => setPersonalGoal(e.target.value)}
              placeholder="What are you mastering in this session?"
              className="w-full bg-[#121824] border border-[#1b2538] focus:border-teal-500 rounded-inner px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500">Shared with all party members in the chamber.</p>
          </div>
        </div>
      </div>

      {/* 2. Active Party Presence Video/Audio Tiles */}
      <div className="rounded-card bg-[#0e131d] border border-[#1a2333] p-5 shadow-panel space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Headphones className="w-4 h-4 text-teal-400" />
            Active Chamber Presence ({studyRoom.activeMembers.length} Party Members Online)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-inner text-xs font-medium border transition-colors ${
                isMuted
                  ? 'bg-[#121824] border-[#1b2538] text-slate-400 hover:text-white'
                  : 'bg-teal-950 border-teal-500/60 text-teal-300'
              }`}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-teal-400" />}
              <span>{isMuted ? 'Muted' : 'Speaking'}</span>
            </button>
          </div>
        </div>

        {/* Member Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {studyRoom.activeMembers.map((member, i) => {
            const isSelf = member.name === user.name;
            const currentMuted = isSelf ? isMuted : i % 2 !== 0;

            return (
              <div
                key={i}
                className="rounded-lg bg-[#111724] border border-[#1a2335] p-3 flex flex-col justify-between hover:border-teal-500/40 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar seed={member.avatarSeed} size="md" />
                    <div>
                      <div className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                        {member.name} {isSelf && '(You)'}
                      </div>
                      <span className="text-[10px] font-mono text-teal-400">Lv. {isSelf ? user.level : 12 + i}</span>
                    </div>
                  </div>
                  <div className="p-1 rounded bg-[#0c1018] border border-[#182030]">
                    {currentMuted ? (
                      <MicOff className="w-3 h-3 text-slate-500" />
                    ) : (
                      <div className="flex items-center gap-0.5">
                        <span className="w-0.5 h-2 bg-teal-400 animate-pulse" />
                        <span className="w-0.5 h-3 bg-teal-400 animate-pulse" />
                        <span className="w-0.5 h-1.5 bg-teal-400 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#0c1018] p-2 rounded border border-[#161f2e] text-[10px] text-slate-400 leading-tight">
                  <span className="text-teal-400 font-semibold block mb-0.5">Current Focus:</span>
                  <span className="line-clamp-2">
                    {isSelf ? personalGoal : participantStatuses[member.name] || 'Studying Algorithms'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
