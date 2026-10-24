import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { StudyRoom, UserProfile, GuildMember } from '../../types';
import { Avatar } from '../common/Avatar';

interface StudyChatViewProps {
  studyRoom: StudyRoom;
  user: UserProfile;
  members: GuildMember[];
  onOpenFocusChamber: () => void;
  onMemberClick?: (member: GuildMember) => void;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  timestamp: string;
  text: string;
  codeSnippet?: string;
  reactions: { emoji: string; count: number; users: string[] }[];
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

  const channels = [
    { id: 'sql-joins', name: 'sql-joins-room', desc: 'Inner, Left, Cross joins and Cartesian resolution', unread: 0 },
    { id: 'general-study', name: 'general-study', desc: 'Daily study goals, accountability & chill lofi', unread: 2 },
    { id: 'boss-tactics', name: 'boss-raid-tactics', desc: 'Query Devourer Phase 2 B-Tree strategy', unread: 0 },
    { id: 'code-review', name: 'schema-reviews', desc: '3NF normalization & index performance logs', unread: 0 }
  ];

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'sql-joins': [
      {
        id: 'msg-1',
        senderName: 'Aviral Maurya',
        senderAvatar: 'aviral',
        senderRole: 'Shadow Scholar',
        timestamp: '19:12',
        text: 'Working through outer join edge cases in LeetCode #185. Notice how `LEFT JOIN` on a partitioned table behaves without pruning:',
        codeSnippet: `SELECT \n  d.name AS Department,\n  e.name AS Employee,\n  e.salary\nFROM Department d\nLEFT JOIN Employee e ON d.id = e.department_id\nWHERE e.salary IS NOT NULL;`,
        reactions: [
          { emoji: '🔥', count: 3, users: ['Eknaath Bawane', 'Ishant Phadatare', 'Ajay Gurjar'] },
          { emoji: '🧠', count: 2, users: ['Ajay Gurjar', 'Aviral Maurya'] }
        ]
      },
      {
        id: 'msg-2',
        senderName: 'Eknaath Bawane',
        senderAvatar: 'eknaath',
        senderRole: 'Blade of Logic',
        timestamp: '19:15',
        text: 'Clean syntax. If you add an index on `(department_id, salary)` the cost drops from 42.50 to 8.12.',
        reactions: [{ emoji: '🚀', count: 4, users: ['Ishant Phadatare', 'Aviral Maurya', 'Ajay Gurjar'] }]
      },
      {
        id: 'msg-3',
        senderName: 'Ajay Gurjar',
        senderAvatar: 'ajay',
        senderRole: 'Arcane Healer',
        timestamp: '19:20',
        text: 'Party Focus Aura is running at 100% capacity! Everyone in the voice room is getting +15% XP per milestone.',
        reactions: [{ emoji: '✨', count: 5, users: ['Ishant Phadatare', 'Aviral Maurya', 'Eknaath Bawane'] }]
      }
    ],
    'general-study': [
      {
        id: 'msg-4',
        senderName: 'Eknaath Bawane',
        senderAvatar: 'eknaath',
        senderRole: 'Blade of Logic',
        timestamp: '18:40',
        text: 'Starting a 50-minute deep work block for SQL query tuning. See you all at the next break!',
        reactions: [{ emoji: '💪', count: 2, users: ['Ishant Phadatare', 'Aviral Maurya'] }]
      }
    ],
    'boss-tactics': [
      {
        id: 'msg-5',
        senderName: 'Astra',
        senderAvatar: 'astra',
        senderRole: 'Guild Master',
        timestamp: '17:30',
        text: 'Heed my warning adventurers: When The Query Devourer begins Phase 2, cast Hash Join Cleave right after Index Surge to trigger a Relational Combo.',
        reactions: [{ emoji: '⚔️', count: 6, users: ['Ishant Phadatare', 'Aviral Maurya', 'Eknaath Bawane', 'Ajay Gurjar'] }]
      }
    ],
    'code-review': [
      {
        id: 'msg-6',
        senderName: 'Ishant Phadatare',
        senderAvatar: 'ishant',
        senderRole: 'Rune Architect',
        timestamp: '16:15',
        text: 'Drafted the composite index migration for party rosters. Feel free to inspect before we merge.',
        reactions: [{ emoji: '👍', count: 3, users: ['Aviral Maurya', 'Eknaath Bawane', 'Ajay Gurjar'] }]
      }
    ]
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !codeSnippet.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: user.name,
      senderAvatar: user.avatarSeed,
      senderRole: user.roleClass,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputMessage.trim(),
      codeSnippet: showCodeInput && codeSnippet.trim() ? codeSnippet.trim() : undefined,
      reactions: []
    };

    setMessages((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg]
    }));

    setInputMessage('');
    setCodeSnippet('');
    setShowCodeInput(false);
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) => {
      const channelMsgs = prev[activeChannel] || [];
      const updated = channelMsgs.map((msg) => {
        if (msg.id !== msgId) return msg;
        const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
        let newReactions = [...msg.reactions];

        if (existingReaction) {
          if (existingReaction.users.includes(user.name)) {
            newReactions = newReactions
              .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1, users: r.users.filter((u) => u !== user.name) } : r))
              .filter((r) => r.count > 0);
          } else {
            newReactions = newReactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, user.name] } : r
            );
          }
        } else {
          newReactions.push({ emoji, count: 1, users: [user.name] });
        }
        return { ...msg, reactions: newReactions };
      });
      return { ...prev, [activeChannel]: updated };
    });
  };

  const currentChannelObj = channels.find((c) => c.id === activeChannel) || channels[0];
  const currentMessages = messages[activeChannel] || [];

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden bg-[#070b13]">
      {/* Top Header with Focus Chamber switcher */}
      <div className="h-13 px-4 sm:px-6 border-b border-[#18233b] bg-[#090f1d] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white flex items-center gap-1 truncate">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                {currentChannelObj.name}
              </span>
              <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#101b33] text-cyan-300 border border-[#1d2f54]">
                Sanctum Thread
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {currentChannelObj.desc}
            </p>
          </div>
        </div>

        {/* Switch to Focus Chamber Button */}
        <button
          onClick={onOpenFocusChamber}
          className="flex items-center gap-2 px-3 py-1.5 rounded-inner bg-[#101c36] hover:bg-[#16274c] text-cyan-300 border border-cyan-800/50 hover:border-cyan-500/60 text-xs font-semibold transition-all shadow-sm active:scale-[0.98]"
        >
          <Headphones className="w-3.5 h-3.5 text-cyan-400" />
          <span>Switch to Focus Timer</span>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>

      {/* Main 3-column / 2-column workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* 1. Left Channels Bar (hidden on xs, 220px on sm+) */}
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
                      ? 'bg-[#121f3b] text-cyan-300 font-semibold border-l-2 border-cyan-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e162b]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{ch.name}</span>
                  </div>
                  {ch.unread > 0 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
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
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Sanctuary Voice
              </span>
              <span className="text-[10px] font-mono text-slate-500">4 in room</span>
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
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3 p-3 rounded-card bg-[#0b1222]/80 border border-[#162136] hover:border-[#1e2e4a] transition-colors"
              >
                <Avatar seed={msg.senderAvatar} size="md" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-100">{msg.senderName}</span>
                    <span className="text-[10px] font-mono text-cyan-400/90 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-900/60">
                      {msg.senderRole}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 ml-auto">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{msg.text}</p>

                  {/* Render Code snippet if present */}
                  {msg.codeSnippet && (
                    <div className="mt-2.5 p-3 rounded-inner bg-[#050810] border border-[#1b2742] font-mono text-[11px] text-cyan-300 overflow-x-auto">
                      <pre>{msg.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Reactions */}
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    {msg.reactions.map((react, i) => {
                      const userReacted = react.users.includes(user.name);
                      return (
                        <button
                          key={i}
                          onClick={() => handleToggleReaction(msg.id, react.emoji)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                            userReacted
                              ? 'bg-cyan-950/70 border-cyan-600 text-cyan-300'
                              : 'bg-[#101729] border-[#1c2944] text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>{react.emoji}</span>
                          <span>{react.count}</span>
                        </button>
                      );
                    })}

                    {/* Quick Add reaction pills */}
                    {['✨', '🚀', '🧠', '⚔️'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleToggleReaction(msg.id, emoji)}
                        className="opacity-0 group-hover:opacity-100 px-1 text-[11px] hover:scale-125 transition-all text-slate-400 hover:text-white"
                        title={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Code Snippet input dropdown */}
          {showCodeInput && (
            <div className="p-3 bg-[#0a101f] border-t border-[#192640]">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-mono mb-1.5">
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
                className="w-full bg-[#050810] border border-[#1c2a47] rounded-inner p-2.5 font-mono text-xs text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          )}

          {/* Bottom Chat Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-[#18233b] bg-[#090f1e] flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCodeInput(!showCodeInput)}
              className={`p-2 rounded-inner border transition-colors ${
                showCodeInput
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
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
              placeholder={`Message #${currentChannelObj.name}...`}
              className="flex-1 bg-[#0d162b] border border-[#1e2f50] rounded-inner px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() && !codeSnippet.trim()}
              className="px-4 py-2 rounded-inner bg-cyan-500 hover:bg-cyan-400 text-[#070b13] font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* 3. Right Channel Members Sidebar (hidden on lg and below, 200px on xl+) */}
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
                <Avatar seed={m.avatarSeed} size="xs" showStatus isOnline statusColor="bg-cyan-400" />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-200 block truncate">{m.name}</span>
                  <span className="text-[9px] font-mono text-cyan-400">Connected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
