import React from 'react';
import {
  Shield,
  Compass,
  Swords,
  Headphones,
  Trophy,
  Users,
  Settings,
  Plus,
  Sparkles,
  BookOpen,
  Zap,
  X,
  MessageSquare
} from 'lucide-react';
import { NavigationItem, Guild, UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { ProgressBar } from '../common/ProgressBar';

interface LeftSidebarProps {
  currentTab: NavigationItem;
  onSelectTab: (tab: NavigationItem) => void;
  selectedGuildId: string;
  onSelectGuild: (guildId: string) => void;
  guilds: Guild[];
  user: UserProfile;
  onCreateGuildClick: () => void;
  onOpenProfile?: () => void;
  onCloseMobile?: () => void;
  isMobileDrawer?: boolean;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedGuildId,
  onSelectGuild,
  guilds,
  user,
  onCreateGuildClick,
  onOpenProfile,
  onCloseMobile,
  isMobileDrawer = false
}) => {
  const navItems: { id: NavigationItem; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'guild_hall', label: 'Guild Hall', icon: <Shield className="w-4 h-4" /> },
    { id: 'quests', label: 'Quests', icon: <Compass className="w-4 h-4" />, badge: '8' },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'boss_arena', label: 'Boss Arena', icon: <Swords className="w-4 h-4" /> },
    { id: 'study_rooms', label: 'Study Sanctuary', icon: <Headphones className="w-4 h-4" /> },
    { id: 'study_chat', label: 'Study Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'friends', label: 'Friends', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const getGuildIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield':
        return <Shield className="w-3.5 h-3.5 text-teal-400" />;
      case 'book-open':
        return <BookOpen className="w-3.5 h-3.5 text-slate-400" />;
      case 'zap':
        return <Zap className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  const handleNavClick = (tab: NavigationItem) => {
    onSelectTab(tab);
    if (isMobileDrawer && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`${
        isMobileDrawer
          ? 'w-72 max-w-[85vw] h-full flex flex-col bg-[#0c1018] border-r border-[#171f2e] shadow-2xl z-50'
          : 'hidden lg:flex w-[240px] flex-shrink-0 bg-[#0c1018] border-r border-[#171f2e] flex-col h-full select-none'
      }`}
    >
      {/* Top Brand Section — Clickable Logo to Homepage */}
      <div className="p-4 border-b border-[#161d2b]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavClick('guild_hall')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
            title="Return to Guild Hall"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141d2c]/80 border border-teal-500/30 flex items-center justify-center p-0.5 group-hover:border-teal-400 group-hover:shadow-[0_0_12px_rgba(20,184,166,0.35)] transition-all">
              <img src="/logo.png" alt="GuildUp Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white text-base group-hover:text-teal-300 transition-colors">
                  GuildUp
                </span>
                <span className="text-[9px] px-1.5 py-0.2 bg-[#141d2c] text-teal-300 font-mono rounded border border-[#1f2d42] font-semibold">
                  v1.0
                </span>
              </div>
            </div>
          </button>

          {isMobileDrawer && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded text-slate-400 hover:text-white"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-400 font-normal mt-1 leading-tight tracking-tight">
          Your party. Your quest. Your next level.
        </p>

        {/* Compact User Profile Section */}
        <div
          onClick={() => onOpenProfile?.()}
          className="mt-3.5 p-2.5 rounded-card bg-[#0f1520] border border-[#1a2333] hover:border-teal-500/40 cursor-pointer transition-colors group"
          title="Click to view full adventurer profile"
        >
          <div className="flex items-center gap-2.5">
            <Avatar seed={user.avatarSeed} size="md" showStatus isOnline statusColor="bg-teal-400" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-100 group-hover:text-teal-300 transition-colors truncate">
                  {user.name}
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-teal-950/80 text-teal-300 border border-teal-800/60">
                  Lv. {user.level}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{user.roleClass}</p>
            </div>
          </div>
          {/* XP Progress Bar */}
          <div className="mt-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1 text-slate-300">
                <Sparkles className="w-2.5 h-2.5 text-teal-400" /> XP
              </span>
              <span>{user.currentXp} / {user.maxXp} XP</span>
            </div>
            <ProgressBar value={user.currentXp} max={user.maxXp} barColor="bg-teal-400" height="h-1.5" />
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        <div>
          <span className="px-2 text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">
            Navigation
          </span>
          <nav className="mt-1.5 space-y-0.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-inner text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-[#141d2c] text-teal-300 border-l-2 border-teal-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#101622]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        item.badge === 'LIVE'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60 font-bold'
                          : 'bg-[#162030] text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Divider & My Guilds */}
        <div className="border-t border-[#161d2b] pt-3">
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">
              My Guilds
            </span>
            <button
              onClick={() => {
                onCreateGuildClick();
                if (isMobileDrawer && onCloseMobile) onCloseMobile();
              }}
              className="p-1 rounded text-slate-400 hover:text-teal-300 hover:bg-[#131b28] transition-colors"
              title="Create or join guild"
              aria-label="Add Guild"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Guild list */}
          <div className="space-y-1">
            {guilds.map((g) => {
              const isSelected = g.id === selectedGuildId;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    onSelectGuild(g.id);
                    if (isMobileDrawer && onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-inner text-xs transition-all text-left group ${
                    isSelected
                      ? 'bg-[#141d2c] text-slate-100 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#101622]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-teal-950/80 border border-teal-500/40' : 'bg-[#141b26] border border-[#1e2736]'
                      }`}
                    >
                      {getGuildIcon(g.emblemIcon)}
                    </div>
                    <span className={`truncate font-medium ${isSelected ? 'text-teal-200' : ''}`}>
                      {g.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 ml-1 flex-shrink-0">
                    {g.memberCount}/{g.maxMembers}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-3 border-t border-[#161d2b] bg-[#0a0d14]">
        <button
          onClick={() => {
            onCreateGuildClick();
            if (isMobileDrawer && onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-inner bg-[#121824] hover:bg-[#182030] text-teal-300 border border-[#1e2736] hover:border-teal-500/40 transition-all shadow-sm active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5 text-teal-400" />
          <span>+ Create / Join Guild</span>
        </button>
      </div>
    </aside>
  );
};
