import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Sparkles,
  Flame,
  CheckCircle,
  Trophy,
  Award,
  BookOpen,
  Edit3,
  Save,
  Check
} from 'lucide-react';
import { UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { ProgressBar } from '../common/ProgressBar';

interface UserProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [roleClass, setRoleClass] = useState(user.roleClass);
  const [bio, setBio] = useState(
    'Specializing in Python backend architectures, Git collaborative flows, and mathematical algorithms.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, roleClass });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const badges = [
    { name: 'Rune Weaver', desc: 'Crafted 10+ custom schemas', icon: <Sparkles className="w-3.5 h-3.5 text-teal-400" /> },
    { name: 'Python Artisan', desc: 'Solved 25 core Python quests', icon: <BookOpen className="w-3.5 h-3.5 text-sky-400" /> },
    { name: 'Streak Veteran', desc: 'Maintained 5-day focus streak', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
    { name: 'Git Vanguard', desc: 'Resolved 10+ merge conflicts', icon: <Shield className="w-3.5 h-3.5 text-purple-400" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0e131d] border border-[#1a2333] rounded-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#161d2a] bg-[#0c1018]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Adventurer Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Top Identity Block */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-inner bg-[#121824] border border-[#192230]">
            <Avatar seed={user.avatarSeed} size="xl" showStatus isOnline statusColor="bg-teal-400" />

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-base font-bold text-white truncate">{user.name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-semibold">
                  Level {user.level}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18202e] text-slate-300 border border-[#222d40]">
                  Scholar Rank II
                </span>
              </div>

              <p className="text-xs text-teal-300/90 font-mono mt-1">{user.roleClass}</p>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {bio}
              </p>
            </div>
          </div>

          {/* XP Progression */}
          <div className="p-4 rounded-inner bg-[#121824] border border-[#192230] space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Experience Points
              </span>
              <span className="text-teal-300 font-bold">{user.currentXp} / {user.maxXp} XP</span>
            </div>
            <ProgressBar
              value={user.currentXp}
              max={user.maxXp}
              barColor="bg-gradient-to-r from-teal-500 to-sky-500"
              height="h-2"
            />
            <span className="text-[10px] text-slate-500 font-mono block">
              {user.maxXp - user.currentXp} XP required to advance to Level {user.level + 1}
            </span>
          </div>

          {/* 3 Metric Summary */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-inner bg-[#121824] border border-[#192230]">
              <div className="flex items-center justify-center gap-1.5 text-amber-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold font-mono">{user.dailyStreak} Days</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Study Streak</span>
            </div>

            <div className="p-3 rounded-inner bg-[#121824] border border-[#192230]">
              <div className="flex items-center justify-center gap-1.5 text-teal-300">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs font-bold font-mono">{user.questsCompletedThisWeek} Quests</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Cleared (Week)</span>
            </div>

            <div className="p-3 rounded-inner bg-[#121824] border border-[#192230]">
              <div className="flex items-center justify-center gap-1.5 text-sky-300">
                <Trophy className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-xs font-bold font-mono">{user.masteryScore}%</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Mastery Score</span>
            </div>
          </div>

          {/* Badges Earned */}
          <div>
            <span className="text-xs font-semibold text-slate-200 block mb-2.5">
              Party Honors & Badges
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-inner bg-[#121824] border border-[#192230] flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded bg-[#18202e] border border-[#222d40] flex items-center justify-center flex-shrink-0">
                    {b.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-200 block truncate">{b.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{b.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Edit Mode Form */}
          {isEditing && (
            <form onSubmit={handleSave} className="p-4 rounded-inner bg-[#121824] border border-teal-500/40 space-y-3">
              <span className="text-xs font-bold text-white block">Edit Adventurer Details</span>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-[#1a2333] rounded-inner px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Class Title</label>
                <input
                  type="text"
                  value={roleClass}
                  onChange={(e) => setRoleClass(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-[#1a2333] rounded-inner px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Study Focus Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-[#1a2333] rounded-inner px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-inner text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-inner bg-teal-600 hover:bg-teal-500 text-[#070b13] font-bold text-xs flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#161d2a] bg-[#0c1018] flex items-center justify-between">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-inner bg-[#141d2c] hover:bg-[#1a2638] text-slate-200 border border-[#202b3d] text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
