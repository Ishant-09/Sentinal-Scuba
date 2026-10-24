import React, { useState } from 'react';
import { Settings, Volume2, Bell, Shield, Palette, Sparkles, Save, Check } from 'lucide-react';
import { UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [roleClass, setRoleClass] = useState(user.roleClass);
  const [soundEffects, setSoundEffects] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, roleClass });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-[#1c2944]">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>Platform Settings & Adventurer Profile</span>
        </h1>
        <p className="text-xs text-slate-400">Configure your study preferences, audio feedback, and party identity</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile Details */}
        <div className="rounded-card bg-[#0e162b] border border-[#1d2b4a] p-5 shadow-panel">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Adventurer Identity
          </h3>

          <div className="flex items-center gap-4 mb-4">
            <Avatar seed={user.avatarSeed} size="lg" />
            <div>
              <span className="text-xs font-semibold text-slate-200">{name}</span>
              <p className="text-[11px] text-cyan-400 font-mono">Level {user.level} • {roleClass}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0a101d] border border-[#1b2844] rounded-inner px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Class Archetype</label>
              <select
                value={roleClass}
                onChange={(e) => setRoleClass(e.target.value)}
                className="w-full bg-[#0a101d] border border-[#1b2844] rounded-inner px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Rune Architect">Rune Architect</option>
                <option value="Shadow Scholar">Shadow Scholar</option>
                <option value="Arcane Healer">Arcane Healer</option>
                <option value="Blade of Logic">Blade of Logic</option>
                <option value="Starbound Coder">Starbound Coder</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audio & Preferences */}
        <div className="rounded-card bg-[#0e162b] border border-[#1d2b4a] p-5 shadow-panel space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            Audio & Ambient Feedback
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-[#17233a]">
            <div>
              <span className="text-xs font-semibold text-slate-200">Encounter Sound Effects</span>
              <p className="text-[11px] text-slate-400">Play subtle synth cues on quest step completion & boss strike</p>
            </div>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs font-semibold text-slate-200">Study Streak Protection</span>
              <p className="text-[11px] text-slate-400">Receive reminders before daily streak resets at midnight</p>
            </div>
            <input
              type="checkbox"
              checked={streakReminders}
              onChange={(e) => setStreakReminders(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-inner bg-cyan-500 hover:bg-cyan-400 text-[#070b13] font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98]"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Changes Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
