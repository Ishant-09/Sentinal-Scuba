import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  User,
  ArrowRight,
  Headphones,
  Radio,
  Flame,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
  Globe
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { UserProfile } from '../../types';

interface LoginPageProps {
  onLogin: (username: string) => void;
  isLoading?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading = false }) => {
  const [username, setUsername] = useState('');

  const demoScholars = [
    { name: 'Ishant Phadatare', role: 'Rune Architect', seed: 'ishant', color: '#06b6d4' },
    { name: 'Aviral Maurya', role: 'Shadow Scholar', seed: 'aviral', color: '#38bdf8' },
    { name: 'Eknaath Bawane', role: 'Blade of Logic', seed: 'eknaath', color: '#10b981' },
    { name: 'Ajay Gurjar', role: 'Arcane Healer', seed: 'ajay', color: '#f59e0b' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    onLogin(trimmed);
  };

  const handleSelectDemo = (name: string) => {
    setUsername(name);
    onLogin(name);
  };

  const cleanSeed = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'adventurer';

  return (
    <div className="min-h-screen w-full bg-[#070b13] text-slate-200 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Background Decorative Glow Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-teal-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar Brand */}
      <header className="h-16 border-b border-[#141d2e] px-6 sm:px-12 flex items-center justify-between z-10 backdrop-blur-md bg-[#070b13]/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 p-0.5 shadow-[0_0_15px_rgba(20,184,166,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#090f1a] rounded-[10px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-white text-base bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent">
                GUILDUP
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold uppercase tracking-wider">
                Sanctum
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
              Multiplayer Study Sanctuaries & Quest Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-400">Live Server Online</span>
        </div>
      </header>

      {/* Main Central Login Workspace */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-lg space-y-6">
          
          {/* Central Card */}
          <div className="bg-[#0c121e]/90 border border-[#1b263b] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 relative group hover:border-teal-500/40 transition-colors">
            {/* Top Card Icon & Title */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-teal-950/80 border border-teal-500/40 text-teal-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(20,184,166,0.25)]">
                <Sparkles className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Enter the Guild Sanctum
              </h1>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Type your adventurer name below. Your profile will be created instantly and logged into all multiplayer sanctuaries.
              </p>
            </div>

            {/* Username Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide">
                  Adventurer Name / Username
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username (e.g. Ishant, ShadowBlade)..."
                    className="w-full bg-[#101726] border border-[#1f2d47] focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 rounded-xl pl-10 pr-4 py-3.5 text-sm font-medium text-white placeholder-slate-500 transition-all focus:outline-none shadow-inner"
                  />
                </div>
              </div>

              {/* Dynamic Live Scholar Card Preview */}
              <div className="p-3 rounded-xl bg-[#080d16] border border-[#182338] flex items-center justify-between gap-3 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar seed={cleanSeed} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {username.trim() || 'Your Adventurer Profile'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    </div>
                    <p className="text-[10px] font-mono text-teal-400 truncate">
                      @{cleanSeed} • Lv. 1 Rune Scholar
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 flex-shrink-0 font-semibold">
                  Live Sync
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#070b13] font-extrabold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#070b13] border-t-transparent rounded-full animate-spin" />
                    <span>Entering Sanctum...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Guild Sanctum</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick-Select Existing Party Scholars */}
            <div className="pt-2 border-t border-[#162033] space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block text-center">
                Or quick-login as a party scholar:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {demoScholars.map((scholar) => (
                  <button
                    key={scholar.name}
                    type="button"
                    onClick={() => handleSelectDemo(scholar.name)}
                    className="p-2 rounded-lg bg-[#0e1524] hover:bg-[#131d30] border border-[#1b263b] hover:border-teal-500/50 text-left transition-all flex items-center gap-2 group"
                  >
                    <Avatar seed={scholar.seed} size="xs" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-200 block truncate group-hover:text-teal-300 transition-colors">
                        {scholar.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block truncate">
                        {scholar.role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Feature Badges Strip */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#0c121e]/60 border border-[#162033] space-y-1">
              <Radio className="w-4 h-4 text-teal-400 mx-auto" />
              <span className="text-[11px] font-semibold text-slate-300 block">Live Multi-Device</span>
              <p className="text-[9px] text-slate-400">Real-time sync on all phones & laptops</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0c121e]/60 border border-[#162033] space-y-1">
              <Headphones className="w-4 h-4 text-cyan-400 mx-auto" />
              <span className="text-[11px] font-semibold text-slate-300 block">Focus Chambers</span>
              <p className="text-[9px] text-slate-400">Synced Pomodoro study timers</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0c121e]/60 border border-[#162033] space-y-1">
              <Flame className="w-4 h-4 text-purple-400 mx-auto" />
              <span className="text-[11px] font-semibold text-slate-300 block">Boss Raids</span>
              <p className="text-[9px] text-slate-400">Query Devourer party encounters</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-[#141d2e] px-6 text-center flex items-center justify-center text-[11px] font-mono text-slate-400 z-10 bg-[#070b13]/80">
        GuildUp Relational Engine • Zero-friction instant scholar authentication
      </footer>
    </div>
  );
};
