import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Hash,
  Send,
  Code,
  Sparkles,
  Headphones,
  Users,
  Search,
  Smile,
  Paperclip,
  Flame,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  ChevronDown,
  UserCheck,
  Radio,
  QrCode
} from 'lucide-react';
import { StudyRoom, UserProfile, GuildMember, ChatMessage } from '../../types';
import { Avatar } from '../common/Avatar';
import { liveChatManager, ChatStore } from '../../utils/liveChatSync';
import { MultiDeviceConnectModal } from '../modals/MultiDeviceConnectModal';

interface StudyChatViewProps {
  studyRoom: StudyRoom;
  user: UserProfile;
  members: GuildMember[];
  onOpenFocusChamber: () => void;
  onMemberClick?: (member: GuildMember) => void;
}

export const StudyChatView: React.FC<StudyChatViewProps> = ({
  studyRoom,
  user,
  members,
  onOpenFocusChamber,
  onMemberClick
}) => {
  const [activeChannel, setActiveChannel] = useState<string>('sql-joins');
  const [inputMessage, setInputMessage] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');

  // Live Multi-Device Chat Store & Device Count
  const [messages, setMessages] = useState<ChatStore>({});
  const [connectedCount, setConnectedCount] = useState<number>(1);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Presenter Persona Switcher (Allows testing/demoing from multiple devices as different characters)
  const [activePersona, setActivePersona] = useState<{
    name: string;
    avatar: string;
    role: string;
  }>({
    name: user.name,
    avatar: user.avatarSeed,
    role: user.roleClass
  });
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const personaMenuRef = useRef<HTMLDivElement | null>(null);

  const channels = [
    { id: 'sql-joins', name: 'sql-joins-room', desc: 'Inner, Left, Cross joins and Cartesian resolution', unread: 0 },
    { id: 'general-study', name: 'general-study', desc: 'Daily study goals, accountability & chill lofi', unread: 0 },
    { id: 'boss-tactics', name: 'boss-raid-tactics', desc: 'Query Devourer Phase 2 B-Tree strategy', unread: 0 },
    { id: 'code-review', name: 'schema-reviews', desc: '3NF normalization & index performance logs', unread: 0 }
  ];

  // Subscribe to live multi-device chat synchronization
  useEffect(() => {
    const unsubMsgs = liveChatManager.subscribeMessages((store) => {
      setMessages(store);
    });

    const unsubDevices = liveChatManager.subscribeDeviceCount((count) => {
      setConnectedCount(count);
    });

    return () => {
      unsubMsgs();
      unsubDevices();
    };
  }, []);

  // Close persona dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (personaMenuRef.current && !personaMenuRef.current.contains(e.target as Node)) {
        setShowPersonaMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Auto-scroll when messages arrive in the active channel
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages[activeChannel]?.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !codeSnippet.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderName: activePersona.name,
      senderAvatar: activePersona.avatar,
      senderRole: activePersona.role,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputMessage.trim(),
      codeSnippet: showCodeInput && codeSnippet.trim() ? codeSnippet.trim() : undefined,
      reactions: []
    };

    // Broadcast across all connected devices via SSE & BroadcastChannel!
    liveChatManager.sendMessage(activeChannel, newMsg);

    setInputMessage('');
    setCodeSnippet('');
    setShowCodeInput(false);
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    liveChatManager.toggleReaction(activeChannel, msgId, emoji, activePersona.name);
  };

  const currentChannelObj = channels.find((c) => c.id === activeChannel) || channels[0];
  const currentMessages = messages[activeChannel] || [];

  const availablePersonas = [
    { name: user.name, avatar: user.avatarSeed, role: user.roleClass, label: `${user.name} (You)` },
    { name: 'Aviral Maurya', avatar: 'aviral', role: 'Shadow Scholar', label: 'Aviral Maurya (Scholar)' },
    { name: 'Eknaath Bawane', avatar: 'eknaath', role: 'Blade of Logic', label: 'Eknaath Bawane (Blade)' },
    { name: 'Ajay Gurjar', avatar: 'ajay', role: 'Arcane Healer', label: 'Ajay Gurjar (Healer)' },
    { name: 'Mobile Presenter', avatar: 'ishant', role: 'Smartphone Demo', label: 'Mobile Presenter (Phone)' }
  ];

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden bg-[#070b13]">
      
      {/* Top Header with Multi-Device Live Sync Button & Focus Chamber switcher */}
      <div className="h-14 px-4 sm:px-6 border-b border-[#18233b] bg-[#090f1d] flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white flex items-center gap-1 truncate">
                <Hash className="w-3.5 h-3.5 text-teal-400" />
                {currentChannelObj.name}
              </span>
              <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#101b33] text-teal-300 border border-[#1d2f54]">
                Sanctum Thread
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {currentChannelObj.desc}
            </p>
          </div>
        </div>

        {/* Center / Right Multi-Device Live Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multi-Device Live Presentation Connect Button */}
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-inner bg-[#0e172a] hover:bg-[#142342] text-teal-300 border border-teal-500/40 hover:border-teal-400 text-xs font-semibold transition-all group shadow-sm"
            title="Open Multi-Device Connect & QR Code"
          >
            <Smartphone className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Multi-Device Live Sync</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-teal-950 text-teal-300 border border-teal-800 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span>{connectedCount} {connectedCount === 1 ? 'device' : 'devices'}</span>
            </span>
          </button>

          {/* Switch to Focus Chamber Button */}
          <button
            onClick={onOpenFocusChamber}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-inner bg-[#101c36] hover:bg-[#16274c] text-teal-300 border border-teal-800/50 hover:border-teal-500/60 text-xs font-semibold transition-all shadow-sm active:scale-[0.98]"
          >
            <Headphones className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Focus Timer</span>
            <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
          </button>
        </div>
      </div>

      {/* Main 3-column workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* 1. Left Channels Bar */}
        <div className="w-56 flex-shrink-0 bg-[#080e1c] border-r border-[#162136] flex flex-col h-full hidden md:flex">
          <div className="p-3 border-b border-[#141d30]">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500 block mb-2">
              Study Channels
            </span>
            <div className="space-y-1">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-inner text-xs transition-colors text-left ${
                    activeChannel === ch.id
                      ? 'bg-[#121f3b] text-teal-300 font-semibold border-l-2 border-teal-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e162b]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{ch.name}</span>
                  </div>
                  {ch.unread > 0 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                      {ch.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Voice Info Box */}
          <div className="p-3 mt-auto border-t border-[#141d30] bg-[#070c18]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-teal-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Live Sync Network
              </span>
              <span className="text-[10px] font-mono text-slate-400">{connectedCount} in sync</span>
            </div>
            <div className="flex items-center -space-x-1.5">
              {studyRoom.activeMembers.map((m, i) => (
                <div key={i} className="ring-2 ring-[#070c18] rounded-full" title={m.name}>
                  <Avatar seed={m.avatarSeed} size="xs" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Central Message Stream */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#070b13] h-full">
          {/* Scrollable Messages Container */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5">
            {currentMessages.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <MessageSquare className="w-8 h-8 text-teal-500/40 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">No messages in this chamber thread yet.</p>
                <p className="text-[11px] text-slate-500">Send a message or code snippet below to start collaborating!</p>
              </div>
            ) : (
              currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 p-3 rounded-card bg-[#0b1222]/80 border border-[#162136] hover:border-[#1e2e4a] transition-colors group"
                >
                  <Avatar seed={msg.senderAvatar} size="md" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-100">{msg.senderName}</span>
                      <span className="text-[10px] font-mono text-teal-400/90 px-1.5 py-0.2 rounded bg-teal-950/60 border border-teal-900/60">
                        {msg.senderRole}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 ml-auto">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed break-words">{msg.text}</p>

                    {/* Render Code snippet if present */}
                    {msg.codeSnippet && (
                      <div className="mt-2.5 p-3 rounded-inner bg-[#050810] border border-[#1b2742] font-mono text-[11px] text-teal-300 overflow-x-auto">
                        <pre>{msg.codeSnippet}</pre>
                      </div>
                    )}

                    {/* Reactions */}
                    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                      {msg.reactions.map((react, i) => {
                        const userReacted = react.users.includes(activePersona.name);
                        return (
                          <button
                            key={i}
                            onClick={() => handleToggleReaction(msg.id, react.emoji)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                              userReacted
                                ? 'bg-teal-950/70 border-teal-600 text-teal-300 font-bold'
                                : 'bg-[#101729] border-[#1c2944] text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span>{react.emoji}</span>
                            <span>{react.count}</span>
                          </button>
                        );
                      })}

                      {/* Quick Add reaction pills */}
                      {['🔥', '🚀', '🧠', '⚔️', '✨'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className="opacity-75 sm:opacity-0 group-hover:opacity-100 px-1 text-[11px] hover:scale-125 transition-all text-slate-400 hover:text-white"
                          title={`React with ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Code Snippet input dropdown */}
          {showCodeInput && (
            <div className="p-3 bg-[#0a101f] border-t border-[#192640]">
              <div className="flex items-center justify-between text-xs text-teal-400 font-mono mb-1.5">
                <span className="flex items-center gap-1">
                  <Code className="w-3.5 h-3.5" /> Code Snippet / SQL Block
                </span>
                <button
                  type="button"
                  onClick={() => setShowCodeInput(false)}
                  className="text-slate-500 hover:text-white text-[10px]"
                >
                  Cancel
                </button>
              </div>
              <textarea
                rows={3}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="-- Paste your SQL query or table schema here..."
                className="w-full bg-[#050810] border border-[#1c2a47] rounded-inner p-2.5 font-mono text-xs text-teal-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>
          )}

          {/* Bottom Chat Input Form with Demo Persona Switcher */}
          <div className="border-t border-[#18233b] bg-[#090f1e] p-2.5 sm:p-3 space-y-2">
            
            {/* Persona Switcher Bar (Demo Feature) */}
            <div className="flex items-center justify-between px-1 text-[11px]">
              <div className="relative" ref={personaMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowPersonaMenu((prev) => !prev)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#111a2f] hover:bg-[#16233f] text-slate-300 hover:text-teal-300 border border-[#1b2a47] transition-colors"
                  title="Switch presenter persona for testing multi-device chat"
                >
                  <Avatar seed={activePersona.avatar} size="xs" />
                  <span className="text-[10px] font-mono">Chatting as:</span>
                  <span className="text-teal-300 font-semibold">{activePersona.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showPersonaMenu && (
                  <div className="absolute left-0 bottom-full mb-1.5 w-60 bg-[#0c1221] border border-teal-500/40 rounded-xl shadow-2xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 border-b border-[#172238] text-[9px] font-mono uppercase text-slate-500">
                      Select Demo Character
                    </div>
                    {availablePersonas.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setActivePersona({ name: p.name, avatar: p.avatar, role: p.role });
                          setShowPersonaMenu(false);
                        }}
                        className={`px-3 py-2 flex items-center justify-between text-xs hover:bg-[#141f38] cursor-pointer transition-colors ${
                          activePersona.name === p.name ? 'bg-teal-950/60 text-teal-300 font-semibold' : 'text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar seed={p.avatar} size="xs" />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{p.label}</p>
                            <p className="text-[10px] text-slate-400 truncate">{p.role}</p>
                          </div>
                        </div>
                        {activePersona.name === p.name && (
                          <UserCheck className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status indicator */}
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="hidden sm:inline">Live broadcast to all devices</span>
              </div>
            </div>

            {/* Main Form Input */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCodeInput(!showCodeInput)}
                className={`p-2 rounded-inner border transition-colors ${
                  showCodeInput
                    ? 'bg-teal-950 border-teal-500 text-teal-300'
                    : 'bg-[#10192e] border-[#1d2d4d] text-slate-400 hover:text-white'
                }`}
                title="Insert Code Snippet"
              >
                <Code className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message #${currentChannelObj.name} as ${activePersona.name}...`}
                className="flex-1 bg-[#0d162b] border border-[#1e2f50] rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/70"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() && !codeSnippet.trim()}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer active:scale-95"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* 3. Right Channel Members Sidebar */}
        <div className="w-52 flex-shrink-0 bg-[#080e1c] border-l border-[#162136] p-3 hidden xl:block overflow-y-auto">
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500 block mb-2.5">
            Party In Room ({studyRoom.activeMembers.length})
          </span>
          <div className="space-y-1.5">
            {studyRoom.activeMembers.map((m, i) => (
              <div
                key={i}
                onClick={() => {
                  const fullMember = members.find((mem) => mem.name === m.name);
                  if (fullMember) onMemberClick?.(fullMember);
                }}
                className="flex items-center gap-2 p-1.5 rounded-inner hover:bg-[#121c33] cursor-pointer transition-colors"
                title={`Click to open ${m.name} menu`}
              >
                <Avatar seed={m.avatarSeed} size="xs" showStatus isOnline statusColor="bg-teal-400" />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-200 block truncate">{m.name}</span>
                  <span className="text-[9px] font-mono text-teal-400">Connected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Device Presentation Connect Modal */}
      <MultiDeviceConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        connectedCount={connectedCount}
      />
    </div>
  );
};
