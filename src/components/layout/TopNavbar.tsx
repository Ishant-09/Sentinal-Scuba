import React, { useState } from 'react';
import { Search, Bell, Settings, X, Check, Flame, Star, ShieldCheck, ChevronDown, Menu, Users } from 'lucide-react';
import { UserProfile, NavigationItem } from '../../types';
import { Avatar } from '../common/Avatar';

interface TopNavbarProps {
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSettings: () => void;
  onToggleMobileMenu: () => void;
  onToggleMobileMembers: () => void;
  onNavigateHome: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  onToggleMobileMenu,
  onToggleMobileMembers,
  onNavigateHome
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    {
      id: 1,
      title: 'Boss Phase 2 Unlocked!',
      desc: 'The Query Devourer has retreated into The Join Labyrinth. Ready your indexes.',
      time: '10m ago',
      unread: true,
      type: 'boss'
    },
    {
      id: 2,
      title: 'Party Study Session Active',
      desc: 'Akira and 2 others are currently live in Study Sanctuary.',
      time: '25m ago',
      unread: true,
      type: 'study'
    },
    {
      id: 3,
      title: 'Daily Streak Bonus',
      desc: '5-day streak maintained! +50 bonus XP claimed.',
      time: '2h ago',
      unread: false,
      type: 'streak'
    }
  ];

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <header className="h-14 border-b border-[#18233b] bg-[#090f1f]/95 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between select-none relative z-30 w-full overflow-x-hidden">
      {/* Left: Mobile Menu Toggle & Brand Logo */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-inner text-slate-400 hover:text-white hover:bg-[#121c33] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Clickable Logo for Mobile & Small Screen Header */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-left group transition-transform active:scale-95"
          title="Return to Guild Hall Homepage"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)] group-hover:border-cyan-400">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-cyan-400" stroke="currentColor" strokeWidth="0.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="font-extrabold tracking-tight text-white text-base hidden sm:inline group-hover:text-cyan-300 transition-colors">
            GuildUp
          </span>
        </button>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search quests, members..."
            className="w-full bg-[#0d162b] border border-[#1e2d4a] rounded-inner pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Streak chip */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-[#131d33] border border-[#213150] text-[11px] font-mono text-amber-300">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          <span>{user.dailyStreak}d</span>
        </div>

        {/* Mobile Members Drawer Button */}
        <button
          onClick={onToggleMobileMembers}
          className="xl:hidden p-1.5 rounded-inner text-slate-400 hover:text-slate-200 hover:bg-[#121c33] transition-colors"
          title="Party & NPC Panel"
          aria-label="Toggle Party Members"
        >
          <Users className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-1.5 sm:p-2 rounded-inner text-slate-400 hover:text-slate-200 hover:bg-[#121c33] transition-colors"
            title="Notifications"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0e172d] border border-[#203052] rounded-card shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#1b2844]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-100">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#17233c]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs hover:bg-[#131f3b] transition-colors cursor-pointer ${
                      n.unread && unreadCount > 0 ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-200 text-[11px]">{n.title}</span>
                      <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-[#1b2844] text-center bg-[#0a1020]">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] text-slate-400 hover:text-slate-200"
                >
                  Close notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 sm:p-2 rounded-inner text-slate-400 hover:text-slate-200 hover:bg-[#121c33] transition-colors"
          title="Platform Settings"
          aria-label="Open Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-1 py-1 rounded-inner hover:bg-[#121c33] border border-transparent hover:border-[#1e2d4a] transition-colors"
            aria-label="User Profile Menu"
          >
            <Avatar seed={user.avatarSeed} size="sm" />
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</div>
              <div className="text-[10px] font-mono text-cyan-400 leading-none">Lv. {user.level}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0e172d] border border-[#203052] rounded-card shadow-2xl py-1 z-50">
              <div className="p-3 border-b border-[#1b2844]">
                <div className="font-semibold text-xs text-slate-100">{user.name}</div>
                <div className="text-[11px] text-slate-400">{user.roleClass}</div>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-cyan-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mastery Score: {user.masteryScore}%</span>
                </div>
              </div>
              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-300 hover:text-white hover:bg-[#142340] flex items-center gap-2"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>Class Perks & Titles</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-300 hover:text-white hover:bg-[#142340] flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account & Audio Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
