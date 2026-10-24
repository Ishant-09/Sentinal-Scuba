import React, { useState, useEffect } from 'react';
import { Swords, Shield, Zap, Sparkles, AlertCircle, ArrowLeft, Heart, Flame, RefreshCw, CheckCircle2 } from 'lucide-react';
import { BossEncounter, UserProfile } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Avatar } from '../common/Avatar';
import confetti from 'canvas-confetti';
import { api } from '../../api/client';
import { useSocketEvent } from '../../realtime/socket';

interface BossArenaViewProps {
  boss: BossEncounter;
  user: UserProfile;
  onBackToGuildHall: () => void;
  onBossDefeated?: () => void;
}

export const BossArenaView: React.FC<BossArenaViewProps> = ({
  boss,
  user,
  onBackToGuildHall,
  onBossDefeated
}) => {
  const [currentHp, setCurrentHp] = useState(boss.currentPhase.bossHp);
  const maxHp = boss.currentPhase.bossMaxHp;
  const [combatLog, setCombatLog] = useState<string[]>([
    'Encounter initiated: Phase 2 — The Join Labyrinth is active.',
    'The Query Devourer casts [Cartesian Storm] — Latency spikes across tables!',
    'Your party is locked in combat. Cast SQL spells to purge corrupted indexes.'
  ]);
  const [isCasting, setIsCasting] = useState(false);
  const [lastDamage, setLastDamage] = useState<number | null>(null);

  // Sync HP from props if boss state updates from server
  useEffect(() => {
    if (boss.currentPhase?.bossHp !== undefined) {
      setCurrentHp(boss.currentPhase.bossHp);
    }
  }, [boss.currentPhase?.bossHp]);

  // Listen for real-time boss hits from other party members
  useSocketEvent('boss:hit', (data: any) => {
    if (typeof data.bossHp === 'number') {
      setCurrentHp(data.bossHp);
      setCombatLog((prev) => [
        `⚔️ ${data.attackerName || 'Party member'} used [${data.abilityName}] dealing ${data.damage}${data.isCritical ? ' (CRITICAL!)' : ''} relational damage!`,
        ...prev.slice(0, 5)
      ]);
      if (data.bossHp <= 0) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        onBossDefeated?.();
      }
    }
  });

  const attacks = [
    {
      name: 'Index Surge',
      role: 'Rune Architect',
      damage: 1250,
      desc: 'Creates a B-Tree index on foreign keys to bypass nested loops.',
      icon: <Zap className="w-4 h-4 text-cyan-400" />
    },
    {
      name: 'Hash Join Cleave',
      role: 'Blade of Logic',
      damage: 1800,
      desc: 'Builds an in-memory hash table for O(N) relational matching.',
      icon: <Swords className="w-4 h-4 text-rose-400" />
    },
    {
      name: 'Explain Analyze Scan',
      role: 'Shadow Scholar',
      damage: 950,
      desc: 'Pinpoints buffer cache misses and reduces I/O wait.',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />
    },
    {
      name: 'Transaction Commit Ward',
      role: 'Arcane Healer',
      damage: 600,
      desc: 'Applies ACID guarantees, purging deadlocks.',
      icon: <Shield className="w-4 h-4 text-purple-400" />
    }
  ];

  const handleCastSpell = async (attack: typeof attacks[0]) => {
    if (isCasting || currentHp <= 0) return;
    setIsCasting(true);

    try {
      const res = await api.boss.attack(attack.name);
      if (res && typeof res.bossHp === 'number') {
        setLastDamage(res.damage);
        setCurrentHp(res.bossHp);
        setCombatLog((prev) => [
          `⚔️ ${user.name} (${attack.role}) used [${attack.name}] dealing ${res.damage}${res.isCritical ? ' (CRITICAL!)' : ''} relational damage!`,
          ...prev.slice(0, 5)
        ]);

        if (res.bossHp === 0) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          setCombatLog((prev) => [
            `🏆 VICTORY! The Query Devourer Phase 2 shattered! +400 Guild XP distributed.`,
            ...prev
          ]);
          onBossDefeated?.();
        }
        setTimeout(() => setIsCasting(false), 600);
        return;
      }
    } catch {
      // offline fallback
    }

    const dmg = attack.damage + Math.floor(Math.random() * 200 - 100);
    setLastDamage(dmg);

    const newHp = Math.max(0, currentHp - dmg);
    setCurrentHp(newHp);

    setCombatLog((prev) => [
      `⚔️ ${user.name} (${attack.role}) used [${attack.name}] dealing ${dmg} relational damage!`,
      ...prev.slice(0, 5)
    ]);

    if (newHp === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setCombatLog((prev) => [
        `🏆 VICTORY! The Query Devourer Phase 2 shattered! +400 Guild XP distributed.`,
        ...prev
      ]);
      onBossDefeated?.();
    }

    setTimeout(() => {
      setIsCasting(false);
    }, 600);
  };

  const handleReset = () => {
    setCurrentHp(maxHp);
    setCombatLog(['Combat state reset. The Query Devourer has reformed its index core.']);
  };

  const hpPercentage = Math.round((currentHp / maxHp) * 100);

  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1c2944]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGuildHall}
            className="p-1.5 rounded-inner bg-[#121d33] hover:bg-[#1a2b4d] text-slate-400 hover:text-white border border-[#203152] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white uppercase tracking-wider">{boss.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                {boss.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-400">{boss.subtitle}</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-[#10182c] border border-[#1e2e4f] rounded-inner transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Raid</span>
        </button>
      </div>

      {/* Main Boss Raid Arena Card */}
      <div className="rounded-card bg-gradient-to-b from-[#131124] to-[#0c1424] border border-rose-900/40 p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle geometric boss emblem center */}
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#24101e] border-2 border-rose-500/60 flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.35)]">
              <svg viewBox="0 0 48 48" className="w-10 h-10 fill-none stroke-rose-400" strokeWidth="2.5">
                <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" />
                <circle cx="24" cy="24" r="8" fill="#f43f5e" fillOpacity="0.3" stroke="#f43f5e" strokeWidth="2" />
                <path d="M18 24h12M24 18v12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            {lastDamage && isCasting && (
              <span className="absolute -top-3 -right-6 text-sm font-black font-mono text-rose-400 animate-bounce">
                -{lastDamage}
              </span>
            )}
          </div>

          <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-wider mt-4">
            {boss.name}
          </h2>
          <span className="text-xs font-mono text-cyan-300 mt-1">{boss.currentPhase.name}</span>

          {/* Boss HP Bar */}
          <div className="w-full max-w-lg mt-4 bg-[#0a0f1d] p-3 rounded-inner border border-[#212f4d]">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="text-rose-400 flex items-center gap-1 font-bold">
                <Heart className="w-3.5 h-3.5 fill-rose-500" /> BOSS HEALTH
              </span>
              <span className="text-slate-300">
                {currentHp.toLocaleString()} / {maxHp.toLocaleString()} HP ({hpPercentage}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-rose-950">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Phase Indicators */}
        <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto text-center text-xs font-mono">
          {boss.phases.map((p) => (
            <div
              key={p.number}
              className={`p-2 rounded-inner border ${
                p.status === 'completed'
                  ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                  : p.status === 'active'
                  ? 'bg-rose-950/60 border-rose-600 text-rose-200 font-bold'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <span>{p.name.split('—')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action / Spells Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Spell Actions (8 cols) */}
        <div className="md:col-span-8 rounded-card bg-[#0e162b] border border-[#1e2d4a] p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#18233c] mb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Party Combat Abilities
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Turn Ready</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {attacks.map((att, idx) => (
              <button
                key={idx}
                onClick={() => handleCastSpell(att)}
                disabled={isCasting || currentHp <= 0}
                className="p-3 rounded-inner bg-[#121c33] hover:bg-[#1a2b4e] border border-[#203152] hover:border-cyan-500/50 text-left transition-all group active:scale-[0.98] disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {att.icon}
                    <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-200">
                      {att.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">~{att.damage} DMG</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">{att.desc}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-500">Class: {att.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Combat Log (4 cols) */}
        <div className="md:col-span-4 rounded-card bg-[#0b1222] border border-[#192640] p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider pb-2 border-b border-[#162136] mb-2">
              Combat Feed
            </h3>
            <div className="space-y-2 text-[11px] font-mono text-slate-300">
              {combatLog.map((log, i) => (
                <div key={i} className="p-1.5 rounded bg-[#0f172a] border border-[#1b2742] leading-tight">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
