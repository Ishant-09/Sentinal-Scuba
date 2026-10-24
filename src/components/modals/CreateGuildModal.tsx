import React, { useState } from 'react';
import { X, Shield, Plus, Users, Sparkles, AlertCircle } from 'lucide-react';
import { Guild } from '../../types';

interface CreateGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGuild: (guild: Guild) => void;
  onJoinGuildCode: (code: string) => boolean;
  onError: (msg: string) => void;
}

export const CreateGuildModal: React.FC<CreateGuildModalProps> = ({
  isOpen,
  onClose,
  onCreateGuild,
  onJoinGuildCode,
  onError
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emblemColor, setEmblemColor] = useState('#06b6d4');
  const [inviteCode, setInviteCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = name.trim();
    if (cleanName.length < 3) {
      const err = 'Guild name must contain at least 3 characters.';
      setFormError(err);
      onError(err);
      return;
    }

    const newGuild: Guild = {
      id: `guild-${Date.now()}`,
      name: cleanName,
      tag: cleanName.slice(0, 3).toUpperCase(),
      level: 1,
      currentXp: 0,
      maxXp: 2000,
      memberCount: 1,
      maxMembers: 10,
      onlineCount: 1,
      description: description.trim() || 'A new party forged for collaborative SQL mastery.',
      emblemColor: emblemColor,
      emblemIcon: 'shield'
    };

    onCreateGuild(newGuild);
    setName('');
    setDescription('');
    onClose();
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCode = inviteCode.trim().toUpperCase();
    if (!cleanCode) {
      const err = 'Please enter a valid guild invite code.';
      setFormError(err);
      onError(err);
      return;
    }

    const success = onJoinGuildCode(cleanCode);
    if (success) {
      setInviteCode('');
      onClose();
    } else {
      const err = `Invalid or expired guild code: ${cleanCode}. Try SHADOW, SCHOLAR, or CODE.`;
      setFormError(err);
      onError(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0d1629] border border-[#203254] rounded-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1b2a47] bg-[#0a101f]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-white">Guild Sanctum</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#1b2a47] bg-[#090f1d]">
          <button
            onClick={() => {
              setTab('create');
              setFormError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === 'create'
                ? 'border-cyan-400 text-cyan-300 bg-[#0e172a]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Create New Guild
          </button>
          <button
            onClick={() => {
              setTab('join');
              setFormError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === 'join'
                ? 'border-cyan-400 text-cyan-300 bg-[#0e172a]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Join with Invite Code
          </button>
        </div>

        {/* Error Alert if any */}
        {formError && (
          <div className="mx-5 mt-4 p-2.5 rounded-inner bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-5">
          {tab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Guild Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full bg-[#090f1e] border border-[#1b2b48] rounded-inner px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Party Mission Statement</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#090f1e] border border-[#1b2b48] rounded-inner px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Emblem Accent</label>
                <div className="flex gap-2">
                  {['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEmblemColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        emblemColor === color ? 'scale-110 border-white ring-2 ring-cyan-500/50' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-inner bg-cyan-500 hover:bg-cyan-400 text-[#070b13] font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Found Guild</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Guild Invite Code</label>
                <input
                  type="text"
                  required
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full bg-[#090f1e] border border-[#1b2b48] rounded-inner px-3 py-2 text-xs text-slate-200 uppercase font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                  Sample active party codes: SHADOW, SCHOLAR, CODE
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 rounded-inner bg-[#142340] hover:bg-[#1c325c] text-cyan-200 border border-cyan-700/50 text-xs font-bold transition-all"
              >
                Join Guild
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
