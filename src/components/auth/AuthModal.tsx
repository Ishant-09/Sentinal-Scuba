import React, { useState } from 'react';
import { Shield, Sparkles, X, Lock, Mail, User, UserCheck, ArrowRight, KeyRound } from 'lucide-react';
import { api, setAccessToken } from '../../api/client';
import { Avatar } from '../common/Avatar';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (user: any) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onShowToast
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [roleClass, setRoleClass] = useState('Rune Architect');

  if (!isOpen) return null;

  const demoScholars = [
    { email: 'ishant@guildup.dev', name: 'Ishant Phadatare', role: 'Rune Architect', seed: 'ishant', color: '#06b6d4' },
    { email: 'aviral@guildup.dev', name: 'Aviral Maurya', role: 'Shadow Scholar', seed: 'aviral', color: '#38bdf8' },
    { email: 'eknaath@guildup.dev', name: 'Eknaath Bawane', role: 'Blade of Logic', seed: 'eknaath', color: '#10b981' },
    { email: 'ajay@guildup.dev', name: 'Ajay Gurjar', role: 'Arcane Healer', seed: 'ajay', color: '#f59e0b' }
  ];

  const handleQuickDemoLogin = async (demoEmail: string, demoName: string) => {
    setLoading(true);
    try {
      const res = await api.auth.login({
        email: demoEmail,
        password: 'ScholarPass123!'
      });
      setAccessToken(res.accessToken);
      onShowToast('success', `Welcome back, ${demoName}!`, 'Authenticated with backend session.');
      onSuccess(res.user);
    } catch (err: any) {
      onShowToast('error', 'Authentication Failed', err.message || 'Could not log in');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const res = await api.auth.register({
          email: email.trim(),
          password,
          name: name.trim(),
          handle: handle.trim().toLowerCase().replace(/\s+/g, '_'),
          roleClass,
          avatarSeed: handle.trim().toLowerCase()
        });
        setAccessToken(res.accessToken);
        onShowToast('success', `Scholar Registered!`, `Welcome to GuildUp, ${res.user.name}!`);
        onSuccess(res.user);
      } else {
        const res = await api.auth.login({
          email: email.trim(),
          password
        });
        setAccessToken(res.accessToken);
        onShowToast('success', `Welcome back, ${res.user.name}!`);
        onSuccess(res.user);
      }
    } catch (err: any) {
      onShowToast('error', 'Authentication Failed', err.message || 'Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md bg-[#0b101c] border border-teal-500/40 rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 text-slate-200">
        
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-inner hover:bg-[#152033] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Brand Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#182338]">
          <div className="w-9 h-9 rounded-xl bg-teal-950/80 border border-teal-500/50 flex items-center justify-center p-1 text-teal-400">
            <img src="/logo.png" alt="GuildUp" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{isRegister ? 'Create Scholar Account' : 'Adventurer Log In'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 font-semibold">
                v1.0 Backend
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Connect to live PostgreSQL & Redis real-time services
            </p>
          </div>
        </div>

        {/* Quick Demo Login Shortcuts */}
        <div className="my-4">
          <label className="text-[10px] font-mono text-teal-400/90 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>1-Click Presentation Demo Login</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {demoScholars.map((s) => (
              <button
                key={s.email}
                type="button"
                onClick={() => handleQuickDemoLogin(s.email, s.name)}
                disabled={loading}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#0f172a] hover:bg-[#152342] border border-[#1b2a47] hover:border-teal-500/60 transition-all text-left group disabled:opacity-50"
              >
                <Avatar seed={s.seed} size="xs" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-100 group-hover:text-teal-300 truncate">
                    {s.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] font-mono text-slate-400 truncate">{s.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-[#182338] w-full" />
          <span className="bg-[#0b101c] px-2 text-[10px] font-mono text-slate-500 uppercase">
            or credentials
          </span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ishant Phadatare"
                    className="w-full bg-[#101728] border border-[#1b2640] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Adventurer Handle</label>
                <div className="relative">
                  <span className="text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono">@</span>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. ishant_dev"
                    className="w-full bg-[#101728] border border-[#1b2640] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Class Archetype</label>
                <select
                  value={roleClass}
                  onChange={(e) => setRoleClass(e.target.value)}
                  className="w-full bg-[#101728] border border-[#1b2640] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Rune Architect">Rune Architect</option>
                  <option value="Shadow Scholar">Shadow Scholar</option>
                  <option value="Blade of Logic">Blade of Logic</option>
                  <option value="Arcane Healer">Arcane Healer</option>
                  <option value="Code Shinobi">Code Shinobi</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@guildup.dev"
                className="w-full bg-[#101728] border border-[#1b2640] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#101728] border border-[#1b2640] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md mt-2 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isRegister ? (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Enter Guild Hall</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Switch Login / Register Mode */}
        <div className="mt-4 pt-3 border-t border-[#182338] text-center text-xs">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-teal-400 hover:text-teal-300 transition-colors font-medium"
          >
            {isRegister ? 'Already have an adventurer account? Log in' : "Don't have an account yet? Register here"}
          </button>
        </div>

      </div>
    </div>
  );
};
