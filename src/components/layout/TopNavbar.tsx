import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Bell,
  Settings,
  X,
  Check,
  Flame,
  Star,
  ChevronDown,
  Menu,
  Users,
  Compass,
  User,
  ArrowRight,
  Sun,
  Moon,
  Swords,
  Headphones,
  Sparkles,
  Trash2,
  CheckCheck,
  History,
  TrendingUp,
  Code,
  BookOpen,
  Trophy,
  MessageSquare,
  CornerDownLeft,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { UserProfile, AppNotification, NavigationItem } from '../../types';
import { Avatar } from '../common/Avatar';

interface TopNavbarProps {
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  connectionStatus?: 'connected' | 'connecting' | 'disconnected';
  onToggleMobileMenu: () => void;
  onToggleMobileMembers: () => void;
  onNavigateHome: () => void;
  onQuickNavigate?: (target: NavigationItem) => void;
  onOpenWhisperMember?: (memberId: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  notifications?: AppNotification[];
  onSelectNotification?: (notif: AppNotification) => void;
  onMarkAllNotificationsRead?: () => void;
  onClearAllNotifications?: () => void;
  onDeleteNotification?: (id: string) => void;
}

interface CatalogItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  category: 'quest' | 'member' | 'chamber' | 'boss' | 'nav';
  targetTab: NavigationItem;
  filterQuery?: string;
  memberId?: string;
}

const RECENT_SEARCHES_STORAGE_KEY = 'guildup_recent_searches_v2';
const DEFAULT_RECENT_SEARCHES = ['Learning Python', 'Aviral Maurya', 'Git & GitHub', 'The Query Devourer'];

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  onOpenProfile,
  onOpenAuthModal,
  onLogout,
  connectionStatus = 'connected',
  onToggleMobileMenu,
  onToggleMobileMembers,
  onNavigateHome,
  onQuickNavigate,
  onOpenWhisperMember,
  isDarkMode,
  onToggleTheme,
  notifications = [],
  onSelectNotification,
  onMarkAllNotificationsRead,
  onClearAllNotifications,
  onDeleteNotification
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'quest' | 'member' | 'chamber' | 'boss'>('all');
  const [keyboardSelectedIndex, setKeyboardSelectedIndex] = useState<number>(-1);

  // Persistent Recent Searches (Google Style)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  const notifRef = useRef<HTMLDivElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Global keyboard shortcut to trigger search (Ctrl+K, Cmd+K, or '/')
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Close notifications and search dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== term);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === 'unread') return n.unread;
    return true;
  });

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'boss':
        return <Swords className="w-3.5 h-3.5 text-rose-400" />;
      case 'study':
        return <Headphones className="w-3.5 h-3.5 text-teal-400" />;
      case 'streak':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'quest':
        return <Compass className="w-3.5 h-3.5 text-sky-400" />;
      case 'achievement':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-teal-400" />;
    }
  };

  // Google Search Comprehensive Catalog across Real Curriculums, Members, Chambers & Raids
  const searchCatalog: CatalogItem[] = useMemo(() => [
    // Quests & Curriculum Tracks
    { id: 'q1', title: 'Learning Python: Core & Scripting', subtitle: 'Variables, comprehensions & control flow (120 XP)', badge: 'QUEST', category: 'quest', targetTab: 'quests', filterQuery: 'Python' },
    { id: 'q2', title: 'Object-Oriented Python Architecture', subtitle: 'Dunder methods, classes & modularity (220 XP)', badge: 'QUEST', category: 'quest', targetTab: 'quests', filterQuery: 'Python' },
    { id: 'q3', title: 'Computer Programming: Algorithmic Complexity', subtitle: 'Big-O O(N log N) asymptotic bounds (200 XP)', badge: 'QUEST', category: 'quest', targetTab: 'quests', filterQuery: 'Computer Programming' },
    { id: 'q4', title: 'Design Patterns & Clean Code', subtitle: 'SOLID architecture, Factory & Observer (250 XP)', badge: 'QUEST', category: 'quest', targetTab: 'quests', filterQuery: 'Computer Programming' },
    { id: 'q5', title: 'Git & GitHub: Branching & Merge Conflicts', subtitle: 'Interactive rebase, squash & conflict resolution (140 XP)', badge: 'QUEST', category: 'quest', targetTab: 'quests', filterQuery: 'Git & GitHub' },
    { id: 'q6', title: 'Mathematics for CS: Discrete Proofs', subtitle: 'Mathematical induction & graph theory (280 XP)', badge: 'QUEST', category: 'quest', targetTab: 'quests', filterQuery: 'Mathematics' },
    { id: 'q7', title: 'Linear Algebra for Computing', subtitle: 'Vectors, determinants & transition matrices (240 XP)', badge: 'QUEST', category: 'quest', targetTab: 'quests', filterQuery: 'Mathematics' },

    // Real Party Members
    { id: 'm1', title: 'Ishant Phadatare', subtitle: 'Rune Architect • Level 12 (You) • In a quest', badge: 'PARTY', category: 'member', targetTab: 'friends', memberId: 'm1' },
    { id: 'm2', title: 'Aviral Maurya', subtitle: 'Shadow Scholar • Level 14 • In Study Room', badge: 'PARTY', category: 'member', targetTab: 'friends', memberId: 'm2' },
    { id: 'm3', title: 'Eknaath Bawane', subtitle: 'Blade of Logic • Level 13 • In Boss Arena', badge: 'PARTY', category: 'member', targetTab: 'friends', memberId: 'm3' },
    { id: 'm4', title: 'Ajay Gurjar', subtitle: 'Arcane Healer • Level 13 • In Study Room', badge: 'PARTY', category: 'member', targetTab: 'friends', memberId: 'm4' },

    // Virtual Study Chambers
    { id: 'c1', title: 'SQL Sanctuary & Database Core', subtitle: 'PostgreSQL Joins & Query Devourer Raid Prep', badge: 'CHAMBER', category: 'chamber', targetTab: 'study_rooms' },
    { id: 'c2', title: 'Python & Algorithms Chamber', subtitle: 'Dynamic Programming & LeetCode Hard Sprints', badge: 'CHAMBER', category: 'chamber', targetTab: 'study_rooms' },
    { id: 'c3', title: 'Systems & Git DevOps Lab', subtitle: 'Distributed Systems & Merge Conflict War-Room', badge: 'CHAMBER', category: 'chamber', targetTab: 'study_rooms' },
    { id: 'c4', title: 'Discrete Math & Logic Temple', subtitle: 'Induction Proofs & Matrix Theory', badge: 'CHAMBER', category: 'chamber', targetTab: 'study_rooms' },

    // Boss Encounter
    { id: 'b1', title: 'The Query Devourer (Boss Arena)', subtitle: 'Legendary Raid Boss • Phase 2: The Join Labyrinth', badge: 'BOSS', category: 'boss', targetTab: 'boss_arena' },

    // Hub Views
    { id: 'n1', title: 'Guild Leaderboard Standings', subtitle: 'Weekly XP rankings and party podium', badge: 'RANKING', category: 'nav', targetTab: 'leaderboard' },
    { id: 'n2', title: 'Adventurer Achievements & Badges', subtitle: 'Milestone trophies, tier progress & rewards', badge: 'TROPHY', category: 'nav', targetTab: 'achievements' },
    { id: 'n3', title: 'Study Room Chat & Notes', subtitle: 'Live collaborative code exchange and channels', badge: 'CHAT', category: 'nav', targetTab: 'study_chat' }
  ], []);

  // Filtered results based on search query & selected category
  const matchingCatalog = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return searchCatalog.filter((item) => {
      // Category filter check
      if (selectedCategoryFilter !== 'all' && item.category !== selectedCategoryFilter) {
        return false;
      }
      if (!q) return true; // show all in category if empty
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        (item.filterQuery && item.filterQuery.toLowerCase().includes(q))
      );
    });
  }, [searchCatalog, searchQuery, selectedCategoryFilter]);

  // Handle item selection (Google Style)
  const handleSelectSearchItem = (item: CatalogItem) => {
    saveRecentSearch(item.title);

    if (item.category === 'member' && item.memberId && onOpenWhisperMember) {
      onOpenWhisperMember(item.memberId);
      onQuickNavigate?.('friends');
    } else if (item.filterQuery) {
      onSearchChange(item.filterQuery);
      onQuickNavigate?.(item.targetTab);
    } else {
      onSearchChange('');
      onQuickNavigate?.(item.targetTab);
    }

    setIsSearchFocused(false);
    setKeyboardSelectedIndex(-1);
  };

  // Run search on custom query (e.g. Enter pressed on text)
  const handleExecuteSearchQuery = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    saveRecentSearch(clean);
    onSearchChange(clean);
    onQuickNavigate?.('quests');
    setIsSearchFocused(false);
    setKeyboardSelectedIndex(-1);
  };

  // Keyboard navigation for dropdown (Google Style)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setKeyboardSelectedIndex((prev) => {
        const max = matchingCatalog.length - 1;
        return prev < max ? prev + 1 : 0;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setKeyboardSelectedIndex((prev) => {
        const max = matchingCatalog.length - 1;
        return prev > 0 ? prev - 1 : max;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (keyboardSelectedIndex >= 0 && keyboardSelectedIndex < matchingCatalog.length) {
        handleSelectSearchItem(matchingCatalog[keyboardSelectedIndex]);
      } else if (matchingCatalog.length > 0 && searchQuery.trim()) {
        handleSelectSearchItem(matchingCatalog[0]);
      } else if (searchQuery.trim()) {
        handleExecuteSearchQuery(searchQuery);
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setKeyboardSelectedIndex(-1);
      searchInputRef.current?.blur();
    }
  };

  // Helper to render bold matched text (Google Autocomplete style)
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="text-teal-400 font-bold underline decoration-teal-500/40">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const getCategoryIcon = (category: CatalogItem['category']) => {
    switch (category) {
      case 'quest':
        return <Compass className="w-3.5 h-3.5 text-teal-400" />;
      case 'member':
        return <Users className="w-3.5 h-3.5 text-cyan-400" />;
      case 'chamber':
        return <Headphones className="w-3.5 h-3.5 text-teal-300" />;
      case 'boss':
        return <Swords className="w-3.5 h-3.5 text-rose-400" />;
      case 'nav':
        return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Search className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <header className="h-14 border-b border-[#161d2b] bg-[#0c1018] px-3 sm:px-5 flex items-center justify-between select-none relative z-30 w-full overflow-x-hidden">
      {/* Left: Mobile Menu Toggle & Brand Logo */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-inner text-slate-400 hover:text-white hover:bg-[#121824] transition-colors"
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
          <div className="w-8 h-8 rounded-lg bg-[#141d2c]/80 border border-teal-500/30 flex items-center justify-center p-0.5 group-hover:border-teal-400 group-hover:shadow-[0_0_12px_rgba(20,184,166,0.35)] transition-all">
            <img src="/logo.png" alt="GuildUp Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold tracking-tight text-white text-base hidden sm:inline group-hover:text-teal-300 transition-colors">
            GuildUp
          </span>
        </button>
      </div>

      {/* Center: Google-Style Sleek Search Bar & Floating Predictive Dropdown */}
      <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-2 sm:mx-4 relative" ref={searchContainerRef}>
        <div
          className={`relative flex items-center transition-all duration-200 ${
            isSearchFocused
              ? 'ring-2 ring-teal-500/40 bg-[#0e1524] rounded-full border border-teal-500/50 shadow-lg'
              : 'bg-[#101522] rounded-full border border-[#1a2333] hover:border-[#2a3852]'
          }`}
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleSearchKeyDown}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsSearchFocused(true);
              setKeyboardSelectedIndex(-1);
            }}
            placeholder="Search quests, Python, Git, members, boss..."
            className="w-full bg-transparent pl-10 pr-20 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Clear Search"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Keyboard shortcut hint (Google style Cmd+K) */}
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 bg-[#141b2c] border border-[#1d273e]">
              ⌘K
            </span>
          </div>
        </div>

        {/* GOOGLE-STYLE FLOATING SEARCH DROPDOWN MENU */}
        {isSearchFocused && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0a0f19] border border-teal-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
            
            {/* Top Category Filter Pills */}
            <div className="px-3.5 pt-2.5 pb-2 border-b border-[#152033] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
              {(
                [
                  { id: 'all', label: 'All Topics' },
                  { id: 'quest', label: 'Quests' },
                  { id: 'member', label: 'Party Members' },
                  { id: 'chamber', label: 'Chambers' },
                  { id: 'boss', label: 'Boss Arena' }
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors flex-shrink-0 ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'bg-[#101728] hover:bg-[#162138] text-slate-300 border border-[#1b2742]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Content Area: Empty Query State (Recent & Trending) vs Active Query Results */}
            {!searchQuery.trim() && selectedCategoryFilter === 'all' ? (
              <div className="max-h-[380px] overflow-y-auto divide-y divide-[#131c2d]">
                
                {/* 1. Recent Searches (Google Style) */}
                {recentSearches.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center justify-between pb-1.5 px-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <History className="w-3 h-3 text-teal-400" />
                        Recent Searches
                      </span>
                      <button
                        onClick={clearAllRecentSearches}
                        className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors lowercase"
                      >
                        clear history
                      </button>
                    </div>

                    <div className="space-y-0.5 mt-1">
                      {recentSearches.map((term, index) => (
                        <div
                          key={index}
                          onClick={() => handleExecuteSearchQuery(term)}
                          className="px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-[#121a2d] cursor-pointer group transition-colors text-xs text-slate-300"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <History className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 flex-shrink-0" />
                            <span className="truncate group-hover:text-white font-medium">{term}</span>
                          </div>
                          <button
                            onClick={(e) => removeRecentSearch(term, e)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity"
                            title="Remove from history"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Trending & Recommended Study Searches (Google Style) */}
                <div className="p-3">
                  <div className="pb-1.5 px-1 text-[10px] font-mono text-teal-400/90 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-teal-400" />
                    Trending Study Topics
                  </div>

                  <div className="space-y-1 mt-1">
                    {searchCatalog.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSearchItem(item)}
                        className="px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-[#121a2d] cursor-pointer group transition-colors border border-transparent hover:border-[#19253d]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-md bg-[#11192a] border border-[#1a253c] flex items-center justify-center flex-shrink-0">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 truncate">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate leading-tight">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#101728] text-teal-400 border border-teal-500/20 font-bold flex-shrink-0">
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* Active Matching Results (Autocomplete list) */
              <div className="max-h-[380px] overflow-y-auto divide-y divide-[#131c2d]">
                <div className="px-3 py-1.5 text-[10px] font-mono text-slate-500 border-b border-[#141d2e] flex items-center justify-between">
                  <span>Results for "{searchQuery || selectedCategoryFilter}" ({matchingCatalog.length})</span>
                  <span className="text-[9px] text-slate-500 hidden sm:inline">Use ↑ ↓ and ↵ Enter</span>
                </div>

                {matchingCatalog.length === 0 ? (
                  <div className="py-6 px-4 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      No direct catalog match found for <span className="text-teal-300 font-semibold">"{searchQuery}"</span>
                    </p>
                    <button
                      onClick={() => handleExecuteSearchQuery(searchQuery)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs font-medium transition-colors"
                    >
                      <Search className="w-3 h-3" />
                      <span>Search full quest board for "{searchQuery}"</span>
                    </button>
                  </div>
                ) : (
                  matchingCatalog.map((item, idx) => {
                    const isSelected = idx === keyboardSelectedIndex;
                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setKeyboardSelectedIndex(idx)}
                        onClick={() => handleSelectSearchItem(item)}
                        className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition-all border-l-2 ${
                          isSelected
                            ? 'bg-[#131d33] border-teal-400 text-teal-200 pl-3.5'
                            : 'hover:bg-[#101729] border-transparent text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-teal-950/80 border border-teal-600' : 'bg-[#101728] border border-[#19243b]'
                            }`}
                          >
                            {getCategoryIcon(item.category)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs truncate">
                                {renderHighlightedText(item.title, searchQuery)}
                              </span>
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#101728] text-teal-400 border border-teal-500/20 font-bold flex-shrink-0">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5 leading-tight">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0 text-slate-500">
                          {isSelected && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono text-teal-400 mr-1">
                              <span>Jump</span>
                              <CornerDownLeft className="w-2.5 h-2.5" />
                            </span>
                          )}
                          <ArrowRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isSelected ? 'text-teal-400 translate-x-1' : 'text-slate-600'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Google-Style Dropdown Bottom Bar */}
            <div className="px-3 py-1.5 bg-[#080c14] border-t border-[#131c2d] flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-2">
                <span>Google Search Engine</span>
                <span>•</span>
                <span className="text-teal-400/80">Press ↵ Enter to Jump</span>
              </span>
              <span className="text-[9px]">Esc to dismiss</span>
            </div>

          </div>
        )}
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Real-time Connection Status Indicator */}
        <div
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
            connectionStatus === 'connected'
              ? 'bg-teal-950/60 border-teal-700/60 text-teal-300'
              : connectionStatus === 'connecting'
              ? 'bg-amber-950/60 border-amber-700/60 text-amber-300'
              : 'bg-rose-950/60 border-rose-700/60 text-rose-300'
          }`}
          title={`Backend Real-Time State: ${connectionStatus}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-teal-400 animate-pulse'
                : connectionStatus === 'connecting'
                ? 'bg-amber-400 animate-ping'
                : 'bg-rose-400'
            }`}
          />
          <span className="hidden sm:inline">
            {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
          </span>
        </div>

        {/* Streak chip */}
        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded bg-[#111724] border border-[#1a2333] text-[11px] font-mono text-amber-300/90">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>{user.dailyStreak}d streak</span>
        </div>

        {/* Light Mode / Dark Mode Toggle Button on Taskbar (Matching Icons!) */}
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-inner border border-[#1a2333] hover:border-teal-500/50 bg-[#111724] hover:bg-[#141d2c] transition-all text-xs font-medium group"
          title={isDarkMode ? 'Current: Dark Mode (Click to switch to Light Mode)' : 'Current: Light Mode (Click to switch to Dark Mode)'}
          aria-label="Toggle theme mode"
        >
          {isDarkMode ? (
            <>
              <Moon className="w-3.5 h-3.5 text-teal-400 group-hover:-rotate-12 transition-transform" />
              <span className="hidden sm:inline text-[11px] font-mono text-slate-200">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline text-[11px] font-mono text-slate-700 font-semibold">Light</span>
            </>
          )}
        </button>

        {/* Mobile Members Drawer Button */}
        <button
          onClick={onToggleMobileMembers}
          className="xl:hidden p-1.5 rounded-inner text-slate-400 hover:text-slate-200 hover:bg-[#121824] transition-colors"
          title="Party & NPC Panel"
          aria-label="Toggle Party Members"
        >
          <Users className="w-4 h-4 text-teal-400" />
        </button>

        {/* Notification Bell with Full Interactive Notification Center */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 sm:p-2 rounded-inner text-slate-400 hover:text-slate-200 hover:bg-[#121824] transition-colors"
            title="Notifications"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown Window */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0c111c] border border-[#1d273a] rounded-card shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#182030] bg-[#0e1422]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-wide">Notification Center</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-teal-950 text-teal-300 border border-teal-800 rounded font-semibold">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && onMarkAllNotificationsRead && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-[10px] text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark read</span>
                    </button>
                  )}
                  {notifications.length > 0 && onClearAllNotifications && (
                    <button
                      onClick={onClearAllNotifications}
                      className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Clear all notifications"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-Filter Tabs */}
              <div className="flex items-center gap-1 px-3 py-1.5 bg-[#090d16] border-b border-[#161f30] text-[11px]">
                <button
                  onClick={() => setNotifFilter('all')}
                  className={`px-2.5 py-0.5 rounded transition-colors ${
                    notifFilter === 'all'
                      ? 'bg-[#141b2c] text-teal-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setNotifFilter('unread')}
                  className={`px-2.5 py-0.5 rounded transition-colors ${
                    notifFilter === 'unread'
                      ? 'bg-[#141b2c] text-teal-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Notification Items List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-[#151c2a]">
                {filteredNotifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 space-y-1">
                    <Check className="w-6 h-6 text-teal-500/50 mx-auto mb-1.5" />
                    <p className="text-xs text-slate-300 font-medium">All caught up!</p>
                    <p className="text-[10px] text-slate-500">No new notifications in your log.</p>
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onSelectNotification?.(n);
                        setShowNotifications(false);
                      }}
                      className={`p-3 text-xs hover:bg-[#121929] transition-all cursor-pointer flex items-start justify-between gap-2.5 group ${
                        n.unread ? 'bg-teal-950/15 border-l-2 border-teal-400' : 'opacity-85'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#111726] border border-[#1b2538] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-200 text-xs truncate group-hover:text-teal-300 transition-colors">
                              {n.title}
                            </span>
                            {n.unread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                            {n.desc}
                          </p>
                          <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                            {n.time} {n.targetTab && '• Click to view'}
                          </span>
                        </div>
                      </div>

                      {/* Delete notification button */}
                      {onDeleteNotification && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotification(n.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                          title="Dismiss"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-2 border-t border-[#182030] text-center bg-[#090d16]">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
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
          className="p-1.5 sm:p-2 rounded-inner text-slate-400 hover:text-slate-200 hover:bg-[#121824] transition-colors"
          title="Platform Settings"
          aria-label="Open Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Interactive User Profile Button -> Directly Opens User Profile Modal */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-2 py-1 rounded-inner hover:bg-[#121824] border border-transparent hover:border-[#1a2333] transition-colors group"
          title="View Adventurer Profile"
          aria-label="Open Adventurer Profile"
        >
          <Avatar seed={user.avatarSeed} size="sm" />
          <div className="text-left hidden md:block">
            <div className="text-xs font-semibold text-slate-200 leading-tight group-hover:text-teal-300 transition-colors">
              {user.name}
            </div>
            <div className="text-[10px] font-mono text-teal-400 leading-none">Lv. {user.level}</div>
          </div>
        </button>

        {/* Quick Logout / Switch Scholar Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-1.5 sm:p-2 rounded-inner text-slate-400 hover:text-rose-400 hover:bg-[#1e1218] transition-colors"
            title="Log Out / Switch Scholar"
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
