import React, { useState, useEffect } from 'react';
import {
  NavigationItem,
  Guild,
  BossEncounter,
  Quest,
  GuildMember,
  ActivityItem,
  StudyRoom,
  UserProfile,
  AppNotification
} from './types';
import {
  INITIAL_USER,
  INITIAL_GUILDS,
  INITIAL_BOSS,
  INITIAL_QUESTS,
  INITIAL_MEMBERS,
  INITIAL_ACTIVITIES,
  INITIAL_STUDY_ROOM,
  INITIAL_STUDY_ROOMS,
  INITIAL_LEADERBOARD,
  INITIAL_NOTIFICATIONS
} from './data/mockData';

import { LeftSidebar } from './components/layout/LeftSidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { RightSidebar } from './components/layout/RightSidebar';
import { Footer } from './components/layout/Footer';

import { GuildHallView } from './components/views/GuildHallView';
import { QuestsView } from './components/views/QuestsView';
import { LeaderboardView } from './components/views/LeaderboardView';
import { BossArenaView } from './components/views/BossArenaView';
import { StudyRoomsView } from './components/views/StudyRoomsView';
import { StudyChatView } from './components/views/StudyChatView';
import { AchievementsView } from './components/views/AchievementsView';
import { FriendsView } from './components/views/FriendsView';
import { SettingsView } from './components/views/SettingsView';
import { NotFoundView } from './components/views/NotFoundView';

import { CreateGuildModal } from './components/modals/CreateGuildModal';
import { HintChallengeModal } from './components/modals/HintChallengeModal';
import { QuestDetailModal } from './components/modals/QuestDetailModal';
import { StudyRoomModal } from './components/modals/StudyRoomModal';
import { CodexModal } from './components/modals/CodexModal';
import { MemberPopoutMenu } from './components/modals/MemberPopoutMenu';
import { WhisperModal } from './components/modals/WhisperModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { FloatingVoiceWidget } from './components/study/FloatingVoiceWidget';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { LoginPage } from './components/auth/LoginPage';

import { useSocket, useSocketEvent } from './realtime/socket';
import { api, setAccessToken } from './api/client';
import { liveChatManager } from './utils/liveChatSync';

import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavigationItem>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab') as NavigationItem;
      if (tab) return tab;
      const room = urlParams.get('room');
      if (room) return 'study_rooms';
    } catch {
      // ignore
    }
    return 'guild_hall';
  });
  const [selectedGuildId, setSelectedGuildId] = useState<string>('shadow-protocol');
  const [searchQuery, setSearchQuery] = useState('');

  // Light Mode / Dark Mode State with LocalStorage Persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('guildup_theme');
      if (saved) return saved === 'dark';
    } catch {
      // ignore
    }
    return true; // default tranquil dark midnight theme
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('guildup_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('guildup_theme', 'light');
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      addToast(
        'info',
        next ? 'Dark Theme Activated' : 'Light Theme Activated',
        next ? 'Tranquil midnight study ambiance' : 'Crisp daylight study ambiance'
      );
      return next;
    });
  };

  // Mobile Drawer States
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileMembersOpen, setIsMobileMembersOpen] = useState(false);

  // Domain State
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('guildup_username');
      if (saved) {
        const cleanHandle = saved.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 30) || 'scholar';
        return {
          ...INITIAL_USER,
          id: `usr-${cleanHandle}`,
          name: saved,
          handle: `@${cleanHandle}`,
          avatarSeed: cleanHandle
        };
      }
    } catch {}
    return INITIAL_USER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('guildup_logged_in');
    } catch {
      return false;
    }
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [guilds, setGuilds] = useState<Guild[]>(INITIAL_GUILDS);
  const [boss, setBoss] = useState<BossEncounter>(INITIAL_BOSS);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [members, setMembers] = useState<GuildMember[]>(() => {
    try {
      const saved = localStorage.getItem('guildup_username');
      if (saved) {
        const cleanHandle = saved.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 30) || 'scholar';
        const exists = INITIAL_MEMBERS.find(
          (m) => m.name.toLowerCase() === saved.toLowerCase() || m.id === `usr-${cleanHandle}`
        );
        if (exists) {
          return INITIAL_MEMBERS.map((m) =>
            m.name.toLowerCase() === saved.toLowerCase() || m.id === `usr-${cleanHandle}`
              ? { ...m, isOnline: true, status: 'In Guild Hall' }
              : m
          );
        } else {
          const newMember: GuildMember = {
            id: `usr-${cleanHandle}`,
            name: saved,
            roleClass: 'Rune Scholar',
            level: 1,
            status: 'In Guild Hall',
            isOnline: true,
            avatarSeed: cleanHandle,
            avatarColor: '#06b6d4',
            currentXp: 0,
            maxXp: 500
          };
          return [newMember, ...INITIAL_MEMBERS];
        }
      }
    } catch {}
    return INITIAL_MEMBERS;
  });
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>(INITIAL_STUDY_ROOMS);
  const [activeStudyRoomId, setActiveStudyRoomId] = useState<string | null>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const room = urlParams.get('room');
      if (room) return room;
    } catch {
      // ignore
    }
    return null;
  });

  // Check URL query param on mount and when popstate occurs
  useEffect(() => {
    try {
      const checkUrlParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab') as NavigationItem;
        const room = urlParams.get('room');
        if (tab) {
          setCurrentTab(tab);
        } else if (room) {
          setCurrentTab('study_rooms');
          setActiveStudyRoomId(room);
        }
      };
      checkUrlParams();
      window.addEventListener('popstate', checkUrlParams);
      return () => window.removeEventListener('popstate', checkUrlParams);
    } catch {
      // ignore
    }
  }, []);

  const activeStudyRoom = studyRooms.find((r) => r.id === activeStudyRoomId) || studyRooms[0];
  const studyRoom = activeStudyRoom;

  // Active Voice Room Connection State (floating window in bottom right)
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<StudyRoom | null>(INITIAL_STUDY_ROOM);

  // Notification Center State
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const handleSelectNotification = (notif: AppNotification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    // Navigate directly into chamber if this is a chamber invite
    if (notif.roomId) {
      setCurrentTab('study_rooms');
      setActiveStudyRoomId(notif.roomId);
    } else if (notif.targetTab) {
      setCurrentTab(notif.targetTab);
      if (notif.targetTab === 'study_rooms' && !activeStudyRoomId) {
        setActiveStudyRoomId(INITIAL_STUDY_ROOM.id);
      }
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    addToast('info', 'Notifications Marked Read', 'All alerts have been cleared from unread queue.');
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    addToast('info', 'Notifications Cleared', 'All notification logs have been removed.');
  };

  const handleLogin = async (username: string) => {
    setIsLoggingIn(true);
    const trimmed = username.trim();
    const cleanHandle = trimmed.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 30) || 'scholar';

    const newProfile: UserProfile = {
      ...INITIAL_USER,
      id: `usr-${cleanHandle}`,
      name: trimmed,
      handle: `@${cleanHandle}`,
      avatarSeed: cleanHandle,
      roleClass: 'Rune Scholar',
      level: 1,
      currentXp: 0,
      maxXp: 1000,
      dailyStreak: 1,
      questsCompletedThisWeek: 0,
      masteryScore: 0
    };

    setUser(newProfile);
    setIsLoggedIn(true);

    // Add profile to Guild Members roster immediately
    setMembers((prev) => {
      const exists = prev.some(
        (m) => m.name.toLowerCase() === trimmed.toLowerCase() || m.id === newProfile.id
      );
      if (exists) {
        return prev.map((m) =>
          m.name.toLowerCase() === trimmed.toLowerCase() || m.id === newProfile.id
            ? { ...m, isOnline: true, status: 'In Guild Hall' }
            : m
        );
      }
      const newMember: GuildMember = {
        id: newProfile.id || `usr-${cleanHandle}`,
        name: trimmed,
        roleClass: newProfile.roleClass || 'Rune Scholar',
        level: newProfile.level || 1,
        status: 'In Guild Hall',
        isOnline: true,
        avatarSeed: cleanHandle,
        avatarColor: '#06b6d4',
        currentXp: newProfile.currentXp || 0,
        maxXp: newProfile.maxXp || 500
      };
      return [newMember, ...prev];
    });

    // Increment guild member count
    setGuilds((prev) =>
      prev.map((g) =>
        g.id === selectedGuildId
          ? { ...g, memberCount: Math.max(g.memberCount, members.length + 1) }
          : g
      )
    );

    try {
      localStorage.setItem('guildup_logged_in', 'true');
      localStorage.setItem('guildup_username', trimmed);
    } catch {}

    addToast('success', `Welcome to GuildUp, ${trimmed}!`, 'Adventurer profile initialized & live sync active.');

    try {
      const res = await api.auth.usernameLogin(trimmed);
      if (res?.accessToken) {
        setAccessToken(res.accessToken);
      }
      if (res?.user) {
        setUser((prev) => ({
          ...prev,
          ...res.user,
          name: res.user.name || trimmed
        }));
      }
    } catch {
      // offline/fallback mode
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('guildup_logged_in');
    } catch {}
    setAccessToken(null);
    api.auth.logout().catch(() => {});
    addToast('info', 'Logged Out', 'Returned to Adventurer Login Screen.');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleLeaveVoiceRoom = () => {
    setActiveVoiceRoom(null);
    addToast('info', 'Voice Disconnected', 'Left study room voice channel.');
  };

  const handleJoinVoiceRoom = (roomToJoin?: StudyRoom) => {
    const target = roomToJoin || activeStudyRoom || studyRooms[0];
    setActiveVoiceRoom(target);
    addToast('success', 'Voice Connected', `Connected to ${target.name}`);
  };

  const handleEndChamber = async (chamberId: string) => {
    const target = studyRooms.find((r) => r.id === chamberId);
    // Remove from studyRooms so it NEVER shows up in Study Chambers & Virtual Rooms section
    setStudyRooms((prev) => prev.filter((r) => r.id !== chamberId));

    if (activeStudyRoomId === chamberId) {
      setActiveStudyRoomId(null);
      try {
        if (window.history.pushState) {
          window.history.pushState({}, '', window.location.pathname);
        }
      } catch {
        // ignore
      }
    }
    if (activeVoiceRoom?.id === chamberId) {
      setActiveVoiceRoom(null);
    }
    addToast(
      'info',
      'Chamber Ended',
      `"${target?.name || 'Study Chamber'}" has ended and was removed from virtual rooms.`
    );

    try {
      await api.studyRooms.endRoom(chamberId);
    } catch {
      // offline fallback
    }
  };

  // Modals & Popouts State
  const [isCreateGuildOpen, setIsCreateGuildOpen] = useState(false);
  const [mentorModal, setMentorModal] = useState<{ isOpen: boolean; mode: 'hint' | 'challenge' }>({
    isOpen: false,
    mode: 'hint'
  });
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isStudyRoomModalOpen, setIsStudyRoomModalOpen] = useState(false);
  const [codexModal, setCodexModal] = useState<{ isOpen: boolean; type: 'codex' | 'patch_notes' }>({
    isOpen: false,
    type: 'codex'
  });
  const [selectedMemberForPopout, setSelectedMemberForPopout] = useState<GuildMember | null>(null);
  const [activeWhisperMember, setActiveWhisperMember] = useState<GuildMember | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);

  const { status, socket, emit } = useSocket();

  useEffect(() => {
    if (socket) {
      liveChatManager.setSocketEmit(emit);
    }
  }, [socket, emit]);

  // Load initial authoritative data from backend API
  useEffect(() => {
    let isMounted = true;
    async function loadInitialBackendData() {
      try {
        const [meRes, guildsRes, questsRes, roomsRes, bossRes, lbRes, notifsRes, membersRes] = await Promise.allSettled([
          api.users.getMe(),
          api.guilds.getMyGuilds(),
          api.quests.getQuests(),
          api.studyRooms.getRooms(),
          api.boss.getCurrent(),
          api.leaderboard.getWeekly(),
          api.achievements.getNotifications(),
          api.guilds.getMembers(selectedGuildId)
        ]);

        if (!isMounted) return;

        if (meRes.status === 'fulfilled' && meRes.value?.user) {
          setUser(meRes.value.user);
        }
        if (guildsRes.status === 'fulfilled' && guildsRes.value?.guilds?.length) {
          setGuilds(guildsRes.value.guilds);
          if (!guildsRes.value.guilds.some((g: any) => g.id === selectedGuildId)) {
            setSelectedGuildId(guildsRes.value.guilds[0].id);
          }
        }
        if (questsRes.status === 'fulfilled' && questsRes.value?.quests?.length) {
          setQuests(questsRes.value.quests);
        }
        if (roomsRes.status === 'fulfilled' && roomsRes.value?.rooms?.length) {
          setStudyRooms(roomsRes.value.rooms);
        }
        if (bossRes.status === 'fulfilled' && bossRes.value?.boss) {
          setBoss(bossRes.value.boss);
        }
        if (lbRes.status === 'fulfilled' && lbRes.value?.leaderboard?.length) {
          setLeaderboard(lbRes.value.leaderboard);
        }
        if (notifsRes.status === 'fulfilled' && notifsRes.value?.notifications?.length) {
          setNotifications(notifsRes.value.notifications);
        }
        if (membersRes.status === 'fulfilled' && membersRes.value?.members?.length) {
          setMembers((prev) => {
            const map = new Map(prev.map((m) => [m.name.toLowerCase(), m]));
            for (const m of membersRes.value.members) {
              map.set(m.name.toLowerCase(), {
                id: m.id,
                name: m.name,
                roleClass: m.roleClass,
                level: m.level,
                status: m.status || 'In Guild Hall',
                isOnline: true,
                avatarSeed: m.avatarSeed || m.name.toLowerCase(),
                avatarColor: m.avatarColor || '#06b6d4',
                currentXp: m.currentXp || 0,
                maxXp: m.maxXp || 500
              });
            }
            return Array.from(map.values());
          });
        }
      } catch {
        // Fallback to initial mock data (offline mode)
      }
    }

    loadInitialBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Real-Time Socket Event Handlers
  useSocketEvent('xp:gained', (data: any) => {
    if (typeof data.newXp === 'number') {
      setUser((prev) => ({
        ...prev,
        currentXp: data.newXp,
        level: data.level ?? prev.level
      }));
    }
  });

  useSocketEvent('level:up', (data: any) => {
    confetti({ particleCount: 140, spread: 85, origin: { y: 0.6 } });
    addToast('achievement', `LEVEL UP! Level ${data.newLevel} Reached!`, `Congratulations! ${data.message || 'Level milestone unlocked!'}`);
  });

  useSocketEvent('user:stats', (data: any) => {
    setUser((prev) => ({ ...prev, ...data }));
  });

  useSocketEvent('quest:progress', (data: any) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== data.questId) return q;
        const updatedSteps = q.steps.map((s, idx) =>
          data.stepIndex !== undefined && idx === data.stepIndex ? { ...s, completed: true } : s
        );
        return {
          ...q,
          steps: updatedSteps,
          progress: data.progress ?? q.progress,
          completed: data.completed ?? q.completed
        };
      })
    );
  });

  useSocketEvent('guild:member_joined', (newMember: any) => {
    if (!newMember?.name) return;
    setMembers((prev) => {
      const exists = prev.some(
        (m) => m.id === newMember.id || m.name.toLowerCase() === newMember.name.toLowerCase()
      );
      if (exists) {
        return prev.map((m) =>
          m.id === newMember.id || m.name.toLowerCase() === newMember.name.toLowerCase()
            ? { ...m, ...newMember, isOnline: true }
            : m
        );
      }
      return [newMember, ...prev];
    });
    setGuilds((prev) =>
      prev.map((g) =>
        g.id === selectedGuildId
          ? { ...g, memberCount: (g.memberCount || 0) + 1 }
          : g
      )
    );
    addToast('info', 'New Scholar in Guild', `${newMember.name} joined the sanctum roster.`);
  });

  useSocketEvent('guild:stats', (data: any) => {
    if (typeof data?.currentXp === 'number') {
      setGuilds((prev) =>
        prev.map((g) =>
          g.id === selectedGuildId
            ? {
                ...g,
                currentXp: data.currentXp,
                level: data.level ?? g.level,
                maxXp: data.maxXp ?? g.maxXp
              }
            : g
        )
      );
    }
  });

  useSocketEvent('guild:activity', (act: ActivityItem) => {
    if (act?.userName) {
      setActivities((prev) => [act, ...prev.slice(0, 29)]);
    }
  });

  useSocketEvent('boss:hit', (data: any) => {
    if (typeof data.bossHp === 'number') {
      setBoss((prev) => ({
        ...prev,
        currentPhase: {
          ...prev.currentPhase,
          bossHp: data.bossHp
        }
      }));
    }
  });

  useSocketEvent('boss:phase', (data: any) => {
    setBoss((prev) => ({
      ...prev,
      currentPhase: {
        ...prev.currentPhase,
        name: data.phaseName || prev.currentPhase.name,
        bossHp: data.bossHp ?? prev.currentPhase.bossHp
      }
    }));
  });

  useSocketEvent('boss:defeated', (data: any) => {
    setBoss((prev) => ({
      ...prev,
      overallProgress: 100,
      currentPhase: {
        ...prev.currentPhase,
        bossHp: 0,
        status: 'completed'
      }
    }));
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    addToast('achievement', 'VICTORY! The Query Devourer Shattered!', data.message || 'Phase 2 shattered with +400 XP distributed.');
  });

  useSocketEvent('study:room', (data: any) => {
    if (data?.room) {
      setStudyRooms((prev) => {
        const idx = prev.findIndex((r) => r.id === data.room.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = data.room;
          return updated;
        }
        return [data.room, ...prev];
      });
    }
  });

  useSocketEvent('study:ended', (data: any) => {
    if (data?.roomId) {
      setStudyRooms((prev) => prev.filter((r) => r.id !== data.roomId));
      if (activeStudyRoomId === data.roomId) {
        setActiveStudyRoomId(null);
      }
      if (activeVoiceRoom?.id === data.roomId) {
        setActiveVoiceRoom(null);
      }
      addToast('info', 'Study Chamber Ended', `"${data.roomName || 'Study Chamber'}" has ended and was removed.`);
    }
  });

  useSocketEvent('study:participants', (data: any) => {
    if (data?.roomId) {
      setStudyRooms((prev) =>
        prev.map((r) =>
          r.id === data.roomId
            ? {
                ...r,
                onlineCount: data.count ?? r.onlineCount,
                activeMembers: data.participants ?? r.activeMembers
              }
            : r
        )
      );
    }
  });

  useSocketEvent('study:timer', (data: any) => {
    if (data?.roomId) {
      setStudyRooms((prev) =>
        prev.map((r) =>
          r.id === data.roomId
            ? {
                ...r,
                initialTimeSeconds: Math.ceil((data.pausedRemainingMs ?? data.durationMs ?? 1500000) / 1000)
              }
            : r
        )
      );
    }
  });

  useSocketEvent('notification:new', (notif: AppNotification) => {
    setNotifications((prev) => [notif, ...prev]);
    if (notif.roomId) {
      addToast(
        'study',
        notif.title,
        notif.desc,
        'Join Chamber',
        () => {
          setCurrentTab('study_rooms');
          setActiveStudyRoomId(notif.roomId!);
        }
      );
    } else {
      addToast((notif.type as any) || 'info', notif.title, notif.desc);
    }
  });

  useSocketEvent('chat:message', (data: any) => {
    if (data?.channelId && data?.message) {
      liveChatManager.handleSocketMessage(data.channelId, data.message);
    } else if (data?.id && data?.text) {
      const channelId = data.channelId || 'sql-joins';
      liveChatManager.handleSocketMessage(channelId, data);
    }
  });

  useSocketEvent('chat:reaction', (data: any) => {
    if (data?.channelId && data?.messageId && data?.reactions) {
      liveChatManager.handleSocketReaction(data.channelId, data.messageId, data.reactions);
    }
  });

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: ToastMessage['type'],
    title: string,
    description?: string,
    actionText?: string,
    onAction?: () => void
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description, actionText, onAction }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, actionText ? 8500 : 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Selected Guild
  const activeGuild = guilds.find((g) => g.id === selectedGuildId) || guilds[0];

  // Dynamic Document Title based on current tab & guild
  useEffect(() => {
    const titles: Record<NavigationItem, string> = {
      guild_hall: `GuildUp — ${activeGuild.name} (Guild Hall)`,
      quests: 'GuildUp — Active Quests & Curriculum Board',
      leaderboard: 'GuildUp — Guild Leaderboard Standings',
      boss_arena: `GuildUp — Boss Raid: ${boss.name}`,
      study_rooms: `GuildUp — ${studyRoom.name} (Focus Sanctuary)`,
      study_chat: 'GuildUp — Study Room Chat & Notes',
      achievements: 'GuildUp — Adventurer Achievements & Badges',
      friends: 'GuildUp — Party Roster & Friends',
      settings: 'GuildUp — Platform & Profile Settings',
      '404': 'GuildUp — 404: Rune Not Found'
    };
    document.title = titles[currentTab] || 'GuildUp — Your party. Your quest. Your next level.';
  }, [currentTab, activeGuild.name, boss.name, studyRoom.name]);

  // User & Guild XP progression helper
  const awardUserXp = (amount: number, reason: string) => {
    let newLevel = user.level;
    let newCurrentXp = user.currentXp + amount;
    let newMaxXp = user.maxXp;

    setUser((prev) => {
      const nextXp = prev.currentXp + amount;
      if (nextXp >= prev.maxXp) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        addToast(
          'achievement',
          `LEVEL UP! Level ${prev.level + 1} Reached!`,
          `Congratulations! You gained +${amount} XP from ${reason}.`
        );
        setNotifications((n) => [
          {
            id: `notif-${Date.now()}`,
            title: `LEVEL UP! Level ${prev.level + 1} Reached!`,
            desc: `Congratulations! You gained +${amount} XP from ${reason}.`,
            time: 'Just now',
            unread: true,
            type: 'achievement',
            targetTab: 'achievements'
          },
          ...n
        ]);
        newLevel = prev.level + 1;
        newCurrentXp = nextXp - prev.maxXp;
        newMaxXp = Math.round(prev.maxXp * 1.25);
        return {
          ...prev,
          level: newLevel,
          currentXp: newCurrentXp,
          maxXp: newMaxXp
        };
      } else {
        addToast('success', `+${amount} XP Earned`, reason);
        newCurrentXp = nextXp;
        return { ...prev, currentXp: nextXp };
      }
    });

    // 1. ALSO UPDATE THE USER'S ENTRY IN GUILD MEMBERS ROSTER
    setMembers((prev) =>
      prev.map((m) =>
        m.name.toLowerCase() === user.name.toLowerCase() || m.id === user.id
          ? {
              ...m,
              level: newLevel,
              currentXp: newCurrentXp,
              maxXp: newMaxXp
            }
          : m
      )
    );

    // 2. ALSO INCREASE GUILD XP & HANDLE GUILD LEVEL UP
    setGuilds((prev) =>
      prev.map((g) => {
        if (g.id !== selectedGuildId) return g;
        const nextGuildXp = g.currentXp + amount;
        if (nextGuildXp >= g.maxXp) {
          confetti({ particleCount: 110, spread: 75, origin: { y: 0.4 } });
          addToast(
            'achievement',
            `GUILD LEVEL UP! ${g.name} Reached Level ${g.level + 1}!`,
            `The guild gained +${amount} XP and elevated its sanctum mastery.`
          );
          setNotifications((n) => [
            {
              id: `notif-g-${Date.now()}`,
              title: `GUILD ASCENSION: Level ${g.level + 1}!`,
              desc: `${g.name} gained +${amount} XP and reached Guild Level ${g.level + 1}.`,
              time: 'Just now',
              unread: true,
              type: 'party',
              targetTab: 'guild_hall'
            },
            ...n
          ]);
          return {
            ...g,
            level: g.level + 1,
            currentXp: nextGuildXp - g.maxXp,
            maxXp: Math.round(g.maxXp * 1.3)
          };
        }
        return {
          ...g,
          currentXp: nextGuildXp
        };
      })
    );

    // 3. LOG TO GUILD ACTIVITY FEED
    setActivities((prev) => [
      {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        userName: user.name,
        userAvatarSeed: user.avatarSeed,
        userAvatarColor: '#14b8a6',
        actionText: 'earned',
        target: `+${amount} XP (${reason})`,
        timestamp: 'Just now',
        type: 'quest'
      },
      ...prev.slice(0, 29)
    ]);
  };

  // Guild Selection Handler
  const handleSelectGuild = (guildId: string) => {
    setSelectedGuildId(guildId);
    const target = guilds.find((g) => g.id === guildId);
    if (target) {
      addToast('info', `Switched to ${target.name}`, target.description);
    }
  };

  // Create Guild Handler
  const handleCreateGuild = async (newGuild: Guild) => {
    try {
      const res = await api.guilds.createGuild({
        name: newGuild.name,
        tag: newGuild.tag,
        description: newGuild.description,
        icon: newGuild.emblemIcon,
        accentColor: newGuild.emblemColor
      });
      if (res?.guild) {
        setGuilds((prev) => [res.guild, ...prev]);
        setSelectedGuildId(res.guild.id);
        addToast('success', `Guild Founded: ${res.guild.name}!`, 'Your party is ready for new adventurers.');
        return;
      }
    } catch {
      // offline fallback
    }
    setGuilds((prev) => [newGuild, ...prev]);
    setSelectedGuildId(newGuild.id);
    addToast('success', `Guild Founded: ${newGuild.name}!`, 'Your party is ready for new adventurers.');
  };

  // Join Guild by Code Handler
  const handleJoinGuildCode = async (code: string): Promise<boolean> => {
    try {
      const res = await api.guilds.joinGuild(code);
      if (res?.guild) {
        setGuilds((prev) => {
          if (!prev.some((g) => g.id === res.guild.id)) return [...prev, res.guild];
          return prev;
        });
        setSelectedGuildId(res.guild.id);
        addToast('success', `Joined Guild: ${res.guild.name}!`, `Welcome to the ${res.guild.name} roster.`);
        return true;
      }
    } catch {
      // fallback to mock match
    }
    const match = guilds.find(
      (g) => g.tag.toLowerCase() === code.toLowerCase() || g.name.toLowerCase().includes(code.toLowerCase())
    );
    if (match) {
      setSelectedGuildId(match.id);
      addToast('success', `Joined Guild: ${match.name}!`, `Welcome to the ${match.name} roster.`);
      return true;
    }
    return false;
  };

  // Quest Actions
  const handleOpenQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setIsQuestModalOpen(true);
  };

  const handleToggleQuestStep = async (questId: string, stepId: number) => {
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest) return;

    const targetStep = targetQuest.steps.find((s) => s.id === stepId);
    const willBeCompleted = !targetStep?.completed;

    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== questId) return q;
        const updatedSteps = q.steps.map((s) => (s.id === stepId ? { ...s, completed: willBeCompleted } : s));
        const completedCount = updatedSteps.filter((s) => s.completed).length;
        const isDone = completedCount === updatedSteps.length;
        return {
          ...q,
          steps: updatedSteps,
          progress: completedCount,
          completed: isDone
        };
      })
    );

    if (selectedQuest && selectedQuest.id === questId) {
      setSelectedQuest((prev) => {
        if (!prev) return null;
        const updatedSteps = prev.steps.map((s) => (s.id === stepId ? { ...s, completed: willBeCompleted } : s));
        const completedCount = updatedSteps.filter((s) => s.completed).length;
        return {
          ...prev,
          steps: updatedSteps,
          progress: completedCount,
          completed: completedCount === updatedSteps.length
        };
      });
    }

    if (willBeCompleted) {
      // Completed a task/step from the quest!
      const stepCount = Math.max(1, targetQuest.steps.length);
      const stepXp = Math.max(35, Math.floor((targetQuest.rewardXp * 0.8) / stepCount));
      const stepTitle = targetStep?.text
        ? targetStep.text.length > 35
          ? targetStep.text.slice(0, 35) + '...'
          : targetStep.text
        : 'Quest Directive';

      // 1. Award XP to User Profile and Guild
      awardUserXp(stepXp, `quest task: "${stepTitle}"`);

      // 2. Check if all tasks in the quest are now finished
      const remainingSteps = targetQuest.steps.filter((s) => s.id !== stepId && !s.completed);
      if (remainingSteps.length === 0) {
        const totalStepXp = stepXp * stepCount;
        const remainderBonus = Math.max(30, targetQuest.rewardXp - totalStepXp);
        awardUserXp(remainderBonus, `clearing all tasks in [${targetQuest.title}]`);
        confetti({ particleCount: 130, spread: 85, origin: { y: 0.5 } });

        setNotifications((n) => [
          {
            id: `notif-q-${Date.now()}`,
            title: `Quest Conquered: ${targetQuest.title}`,
            desc: `All ${stepCount} trial tasks cleared! +${targetQuest.rewardXp} total XP awarded to you and ${activeGuild.name}.`,
            time: 'Just now',
            unread: true,
            type: 'quest',
            targetTab: 'quests'
          },
          ...n
        ]);

        try {
          await api.quests.completeQuest(questId);
        } catch {}
      }

      // 3. Persist step to backend
      try {
        await api.quests.completeStep(questId, stepId);
      } catch {
        // offline fallback handled
      }
    } else {
      addToast('info', 'Task Unchecked', `Step marked pending in ${targetQuest.title}`);
    }
  };

  const handleCompleteQuest = async (quest: Quest) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === quest.id
          ? {
              ...q,
              completed: true,
              progress: q.maxProgress,
              steps: q.steps.map((s) => ({ ...s, completed: true }))
            }
          : q
      )
    );

    if (selectedQuest && selectedQuest.id === quest.id) {
      setSelectedQuest((prev) =>
        prev
          ? {
              ...prev,
              completed: true,
              progress: prev.maxProgress,
              steps: prev.steps.map((s) => ({ ...s, completed: true }))
            }
          : null
      );
    }

    awardUserXp(quest.rewardXp, `clearing quest ${quest.title}`);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    setNotifications((n) => [
      {
        id: `notif-q-${Date.now()}`,
        title: `Quest Mastered: ${quest.title}`,
        desc: `Earned +${quest.rewardXp} XP for you and ${activeGuild.name}.`,
        time: 'Just now',
        unread: true,
        type: 'quest',
        targetTab: 'quests'
      },
      ...n
    ]);

    try {
      await api.quests.completeQuest(quest.id);
    } catch {
      // offline fallback
    }
  };

  // Boss Actions
  const handleBossDefeated = () => {
    awardUserXp(400, 'shattering Phase 2 of The Query Devourer');
    setBoss((prev) => ({
      ...prev,
      overallProgress: 100,
      currentPhase: {
        ...prev.currentPhase,
        bossHp: 0,
        status: 'completed'
      }
    }));

    setNotifications((n) => [
      {
        id: `notif-b-${Date.now()}`,
        title: 'Victory! The Query Devourer Pushed Back',
        desc: 'Phase 2 shattered with +400 XP awarded to the guild roster.',
        time: 'Just now',
        unread: true,
        type: 'boss',
        targetTab: 'boss_arena'
      },
      ...n
    ]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      userName: user.name,
      userAvatarSeed: user.avatarSeed,
      userAvatarColor: user.avatarColor,
      actionText: 'defeated Phase 2 of',
      target: 'The Query Devourer',
      timestamp: 'Just now',
      type: 'boss'
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Render Central Content based on current navigation tab
  const handleCreateRoom = async (newRoom: StudyRoom, invitedFriends?: string[]) => {
    // 1. Optimistic local state update
    setStudyRooms((prev) => [newRoom, ...prev]);
    setActiveStudyRoomId(newRoom.id);
    addToast(
      'success',
      `Study Chamber "${newRoom.name}" Founded!`,
      invitedFriends && invitedFriends.length > 0
        ? `Invites dispatched to ${invitedFriends.length} party scholar${invitedFriends.length > 1 ? 's' : ''}.`
        : undefined
    );

    // 2. Broadcast room creation over Socket.IO to all devices
    if (emit) {
      emit('study:room', { action: 'created', room: newRoom });
    }

    // 3. Dispatch real-time invites to friends over Socket.IO
    if (invitedFriends && invitedFriends.length > 0) {
      invitedFriends.forEach((friendName) => {
        const notif: AppNotification = {
          id: `notif-invite-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'study',
          title: 'Study Sanctuary Invite',
          desc: `${user.name} invited you to join "${newRoom.name}" (${newRoom.topic})!`,
          time: 'Just now',
          unread: true,
          roomId: newRoom.id,
          roomName: newRoom.name
        };
        if (emit) {
          emit('notification:send', notif);
        }
      });
    }

    // 4. Persist to backend database API
    try {
      await api.studyRooms.createRoom({
        id: newRoom.id,
        name: newRoom.name,
        topic: newRoom.topic,
        maxCapacity: newRoom.maxCapacity,
        initialTimeSeconds: newRoom.initialTimeSeconds || 1500,
        invitedMembers: invitedFriends,
        inviterName: user.name
      });
    } catch {}
  };

  const renderCentralWorkspace = () => {
    switch (currentTab) {
      case 'quests':
        return (
          <QuestsView
            quests={quests}
            onSelectQuest={handleOpenQuest}
            onBackToGuildHall={() => setCurrentTab('guild_hall')}
            onQuestAction={handleOpenQuest}
            globalSearchQuery={searchQuery}
          />
        );

      case 'leaderboard':
        return (
          <LeaderboardView
            entries={leaderboard}
            searchQuery={searchQuery}
            onSelectMember={(id) => {
              const mem = members.find((m) => m.id === id);
              if (mem) setSelectedMemberForPopout(mem);
            }}
          />
        );

      case 'boss_arena':
        return (
          <BossArenaView
            boss={boss}
            user={user}
            onBackToGuildHall={() => setCurrentTab('guild_hall')}
            onBossDefeated={handleBossDefeated}
          />
        );

      case 'study_rooms':
        return (
          <StudyRoomsView
            rooms={studyRooms}
            user={user}
            members={members}
            activeRoomId={activeStudyRoomId}
            onSelectRoom={(roomId) => {
              setActiveStudyRoomId(roomId);
              const r = studyRooms.find((room) => room.id === roomId);
              if (r) {
                setActiveVoiceRoom(r);
                addToast('info', `Entered ${r.name}`, `Focus Topic: ${r.topic}`);
              }
            }}
            onLeaveRoom={() => {
              setActiveStudyRoomId(null);
              try {
                if (window.history.pushState) {
                  window.history.pushState({}, '', window.location.pathname);
                }
              } catch {
                // ignore
              }
            }}
            onEndChamber={handleEndChamber}
            onOpenStudyChat={() => setCurrentTab('study_chat')}
            onRewardXp={(amt, reason) => awardUserXp(amt, reason)}
            onCreateRoom={handleCreateRoom}
          />
        );

      case 'study_chat':
        return (
          <StudyChatView
            studyRoom={studyRoom}
            user={user}
            members={members}
            onOpenFocusChamber={() => setCurrentTab('study_rooms')}
            onMemberClick={(member) => setSelectedMemberForPopout(member)}
          />
        );

      case 'achievements':
        return <AchievementsView />;

      case 'friends':
        return (
          <FriendsView
            members={members}
            onInviteToStudy={(m) => {
              addToast('success', `Study Invite Dispatched to ${m.name}!`);
            }}
            onWhisper={(m) => {
              setActiveWhisperMember(m);
            }}
          />
        );

      case 'settings':
        return (
          <SettingsView
            user={user}
            onUpdateUser={(updated) => {
              setUser((prev) => ({ ...prev, ...updated }));
              addToast('success', 'Profile Preferences Updated');
            }}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        );

      case '404':
        return <NotFoundView onNavigate={(tab) => setCurrentTab(tab)} />;

      case 'guild_hall':
      default:
        return (
          <GuildHallView
            guild={activeGuild}
            boss={boss}
            quests={quests}
            activities={activities}
            user={user}
            onEnterBossArena={() => setCurrentTab('boss_arena')}
            onSelectQuest={handleOpenQuest}
            onViewAllQuests={() => setCurrentTab('quests')}
            onQuestAction={handleOpenQuest}
            onViewRoster={() => setCurrentTab('friends')}
            onOpenStudySanctuary={() => setCurrentTab('study_rooms')}
          />
        );
    }
  };

  // 1. FIRST SCREEN: If user is not logged in, render the dedicated Login Screen!
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-screen bg-[#070b13] text-slate-200 font-sans">
        <LoginPage onLogin={handleLogin} isLoading={isLoggingIn} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // If user is inside a dedicated study room, render full-bleed immersive workspace
  const isDedicatedRoomMode = currentTab === 'study_rooms' && activeStudyRoomId !== null;

  if (isDedicatedRoomMode) {
    return (
      <div className="flex h-screen w-screen overflow-x-hidden overflow-y-hidden bg-[#070b13] text-slate-200 font-sans relative">
        <StudyRoomsView
          rooms={studyRooms}
          user={user}
          members={members}
          activeRoomId={activeStudyRoomId}
          onSelectRoom={(roomId) => {
            setActiveStudyRoomId(roomId);
            const r = studyRooms.find((rm) => rm.id === roomId);
            if (r) setActiveVoiceRoom(r);
          }}
          onLeaveRoom={() => {
            setActiveStudyRoomId(null);
            try {
              if (window.history.pushState) {
                window.history.pushState({}, '', window.location.pathname);
              }
            } catch {
              // ignore
            }
          }}
          onEndChamber={handleEndChamber}
          onOpenStudyChat={() => setCurrentTab('study_chat')}
          onRewardXp={(amt, reason) => awardUserXp(amt, reason)}
          onCreateRoom={handleCreateRoom}
        />
        {/* TOAST SYSTEM */}
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-x-hidden overflow-y-hidden bg-[#0a0d14] text-slate-200 font-sans relative">
      {/* 1. DESKTOP LEFT SIDEBAR (250px) */}
      <LeftSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        selectedGuildId={selectedGuildId}
        onSelectGuild={handleSelectGuild}
        guilds={guilds}
        user={user}
        onCreateGuildClick={() => setIsCreateGuildOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />
          <div className="relative z-10 h-full">
            <LeftSidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setIsMobileNavOpen(false);
              }}
              selectedGuildId={selectedGuildId}
              onSelectGuild={(id) => {
                handleSelectGuild(id);
                setIsMobileNavOpen(false);
              }}
              guilds={guilds}
              user={user}
              onCreateGuildClick={() => {
                setIsCreateGuildOpen(true);
                setIsMobileNavOpen(false);
              }}
              onOpenProfile={() => {
                setIsProfileModalOpen(true);
                setIsMobileNavOpen(false);
              }}
              onCloseMobile={() => setIsMobileNavOpen(false)}
              isMobileDrawer
            />
          </div>
        </div>
      )}

      {/* 2. CENTRAL WORKSPACE AREA WITH TOP NAVBAR */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-x-hidden overflow-y-hidden">
        {/* Top Slim Application Bar */}
        <TopNavbar
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenSettings={() => setCurrentTab('settings')}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          connectionStatus={status}
          onToggleMobileMenu={() => setIsMobileNavOpen(true)}
          onToggleMobileMembers={() => setIsMobileMembersOpen(true)}
          onNavigateHome={() => setCurrentTab('guild_hall')}
          onQuickNavigate={(t) => setCurrentTab(t)}
          onOpenWhisperMember={(memberId) => {
            const found = members.find((m) => m.id === memberId || m.name.toLowerCase().includes(memberId.toLowerCase()));
            if (found) {
              setActiveWhisperMember(found);
            }
          }}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          notifications={notifications}
          onSelectNotification={handleSelectNotification}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onDeleteNotification={handleDeleteNotification}
        />

        {/* Central Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0a0d14] relative flex flex-col justify-between">
          <div className="flex-1">
            {renderCentralWorkspace()}
          </div>

          {/* Minimalist Functional Footer */}
          <Footer
            onOpenCodex={() => setCodexModal({ isOpen: true, type: 'codex' })}
            onOpenPatchNotes={() => setCodexModal({ isOpen: true, type: 'patch_notes' })}
            onNavigateTo404={() => setCurrentTab('404')}
            onReportBug={() => addToast('info', 'Bug Bounty Active', 'Telemetry logs are operating normally.')}
          />
        </main>
      </div>

      {/* 3. DESKTOP RIGHT SIDEBAR (330px) */}
      <RightSidebar
        members={members}
        onOpenMentorHint={() => setMentorModal({ isOpen: true, mode: 'hint' })}
        onOpenMentorChallenge={() => setMentorModal({ isOpen: true, mode: 'challenge' })}
        onMemberClick={(member) => setSelectedMemberForPopout(member)}
      />

      {/* MOBILE RIGHT MEMBERS DRAWER */}
      {isMobileMembersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end xl:hidden">
          <div
            onClick={() => setIsMobileMembersOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />
          <div className="relative z-10 h-full">
            <RightSidebar
              members={members}
              onOpenMentorHint={() => {
                setMentorModal({ isOpen: true, mode: 'hint' });
                setIsMobileMembersOpen(false);
              }}
              onOpenMentorChallenge={() => {
                setMentorModal({ isOpen: true, mode: 'challenge' });
                setIsMobileMembersOpen(false);
              }}
              onMemberClick={(member) => {
                setSelectedMemberForPopout(member);
                setIsMobileMembersOpen(false);
              }}
              onCloseMobile={() => setIsMobileMembersOpen(false)}
              isMobileDrawer
            />
          </div>
        </div>
      )}

      {/* MODALS */}
      <CreateGuildModal
        isOpen={isCreateGuildOpen}
        onClose={() => setIsCreateGuildOpen(false)}
        onCreateGuild={handleCreateGuild}
        onJoinGuildCode={handleJoinGuildCode}
        onError={(err) => addToast('error', 'Guild Action Failed', err)}
      />

      <HintChallengeModal
        isOpen={mentorModal.isOpen}
        mode={mentorModal.mode}
        onClose={() => setMentorModal((prev) => ({ ...prev, isOpen: false }))}
        onRewardXp={(amt) => awardUserXp(amt, 'correctly solving Astra’s challenge')}
      />

      <QuestDetailModal
        quest={selectedQuest}
        isOpen={isQuestModalOpen}
        onClose={() => setIsQuestModalOpen(false)}
        onToggleStep={handleToggleQuestStep}
        onCompleteQuest={handleCompleteQuest}
      />

      <StudyRoomModal
        isOpen={isStudyRoomModalOpen}
        onClose={() => setIsStudyRoomModalOpen(false)}
        studyRoom={activeVoiceRoom || studyRoom}
        user={user}
        onEnterChamber={(roomId) => {
          setCurrentTab('study_rooms');
          setActiveStudyRoomId(roomId);
          const r = studyRooms.find((rm) => rm.id === roomId);
          if (r) setActiveVoiceRoom(r);
        }}
        onLeaveRoom={handleLeaveVoiceRoom}
      />

      <CodexModal
        isOpen={codexModal.isOpen}
        type={codexModal.type}
        onClose={() => setCodexModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* POPOUT MENU FOR MEMBERS */}
      <MemberPopoutMenu
        member={selectedMemberForPopout}
        isOpen={!!selectedMemberForPopout}
        onClose={() => setSelectedMemberForPopout(null)}
        onWhisper={(m) => {
          setActiveWhisperMember(m);
          addToast('info', `Whisper initiated with ${m.name}`, 'Secure party direct channel opened.');
        }}
        onInviteToStudy={(m) => addToast('success', `Study Sanctuary invite sent to ${m.name}`)}
        onChallengeDuel={(m) => addToast('achievement', `SQL Duel challenged to ${m.name}!`, 'Waiting for opponent response.')}
      />

      {/* WHISPER DIRECT MESSAGE WINDOW */}
      <WhisperModal
        member={activeWhisperMember}
        isOpen={!!activeWhisperMember}
        onClose={() => setActiveWhisperMember(null)}
        currentUser={user}
        onInviteToStudy={(m) => {
          addToast('success', `Study Sanctuary invite sent to ${m.name}`);
        }}
        onChallengeDuel={(m) => {
          addToast('achievement', `SQL Duel challenged to ${m.name}!`, 'Waiting for opponent response.');
        }}
      />

      {/* USER PROFILE MODAL */}
      <UserProfileModal
        user={user}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSwitchScholar={() => {
          setIsProfileModalOpen(false);
          handleLogout();
        }}
        onUpdateUser={(updated) => {
          setUser((prev) => ({ ...prev, ...updated }));
          api.users.updateMe(updated).catch(() => {});
          addToast('success', 'Profile Updated Successfully');
        }}
      />

      {/* AUTHENTICATION & SCHOLAR LOGIN MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(newUser) => {
          setUser(newUser);
          setIsAuthModalOpen(false);
        }}
        onShowToast={addToast}
      />

      {/* 4. FLOATING VOICE CHAT ROOM WINDOW (BOTTOM RIGHT CORNER) */}
      {activeVoiceRoom && !isDedicatedRoomMode && (
        <FloatingVoiceWidget
          room={activeVoiceRoom}
          onLeaveRoom={handleLeaveVoiceRoom}
          onExpandChamber={() => {
            setCurrentTab('study_rooms');
            setActiveStudyRoomId(activeVoiceRoom.id);
          }}
          currentUserName={user.name}
        />
      )}

      {/* TOAST SYSTEM */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
