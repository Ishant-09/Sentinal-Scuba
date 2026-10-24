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

import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavigationItem>('guild_hall');
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
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [guilds, setGuilds] = useState<Guild[]>(INITIAL_GUILDS);
  const [boss, setBoss] = useState<BossEncounter>(INITIAL_BOSS);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [members] = useState<GuildMember[]>(INITIAL_MEMBERS);
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
      const checkUrlRoom = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const room = urlParams.get('room');
        if (room) {
          setCurrentTab('study_rooms');
          setActiveStudyRoomId(room);
        }
      };
      checkUrlRoom();
      window.addEventListener('popstate', checkUrlRoom);
      return () => window.removeEventListener('popstate', checkUrlRoom);
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
    // Navigate to target view if defined
    if (notif.targetTab) {
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

  const handleEndChamber = (chamberId: string) => {
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
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
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

  // User XP progression helper
  const awardUserXp = (amount: number, reason: string) => {
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
        return {
          ...prev,
          level: prev.level + 1,
          currentXp: nextXp - prev.maxXp,
          maxXp: Math.round(prev.maxXp * 1.25)
        };
      } else {
        addToast('success', `+${amount} XP Earned`, reason);
        return { ...prev, currentXp: nextXp };
      }
    });

    // Also contribute to Guild XP
    setGuilds((prev) =>
      prev.map((g) =>
        g.id === selectedGuildId
          ? { ...g, currentXp: Math.min(g.maxXp, g.currentXp + amount) }
          : g
      )
    );
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
  const handleCreateGuild = (newGuild: Guild) => {
    setGuilds((prev) => [newGuild, ...prev]);
    setSelectedGuildId(newGuild.id);
    addToast('success', `Guild Founded: ${newGuild.name}!`, 'Your party is ready for new adventurers.');
  };

  // Join Guild by Code Handler
  const handleJoinGuildCode = (code: string): boolean => {
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

  const handleToggleQuestStep = (questId: string, stepId: number) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== questId) return q;
        const updatedSteps = q.steps.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s));
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
        const updatedSteps = prev.steps.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s));
        const completedCount = updatedSteps.filter((s) => s.completed).length;
        return {
          ...prev,
          steps: updatedSteps,
          progress: completedCount,
          completed: completedCount === updatedSteps.length
        };
      });
    }

    addToast('info', 'Quest Objective Updated');
  };

  const handleCompleteQuest = (quest: Quest) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === quest.id ? { ...q, completed: true, progress: q.maxProgress } : q))
    );

    awardUserXp(quest.rewardXp, `clearing ${quest.title}`);

    setNotifications((n) => [
      {
        id: `notif-q-${Date.now()}`,
        title: `Quest Completed: ${quest.title}`,
        desc: `Earned +${quest.rewardXp} XP and upgraded party mastery.`,
        time: 'Just now',
        unread: true,
        type: 'quest',
        targetTab: 'quests'
      },
      ...n
    ]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      userName: user.name,
      userAvatarSeed: user.avatarSeed,
      userAvatarColor: user.avatarColor,
      actionText: 'completed',
      target: quest.title,
      timestamp: 'Just now',
      type: 'quest'
    };
    setActivities((prev) => [newActivity, ...prev]);
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
            onCreateRoom={(newRoom) => {
              setStudyRooms((prev) => [newRoom, ...prev]);
              addToast('success', `Study Chamber "${newRoom.name}" Founded!`);
            }}
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

  // If user is inside a dedicated study room, render full-bleed immersive workspace
  const isDedicatedRoomMode = currentTab === 'study_rooms' && activeStudyRoomId !== null;

  if (isDedicatedRoomMode) {
    return (
      <div className="flex h-screen w-screen overflow-x-hidden overflow-y-hidden bg-[#070b13] text-slate-200 font-sans relative">
        <StudyRoomsView
          rooms={studyRooms}
          user={user}
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
          onCreateRoom={(newRoom) => {
            setStudyRooms((prev) => [newRoom, ...prev]);
            addToast('success', `Study Chamber "${newRoom.name}" Founded!`);
          }}
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
        onUpdateUser={(updated) => {
          setUser((prev) => ({ ...prev, ...updated }));
          addToast('success', 'Profile Updated Successfully');
        }}
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
