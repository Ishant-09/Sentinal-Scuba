import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Send,
  Download,
  Copy,
  Check,
  Code,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { UserProfile, ChatMessage } from '../../types';
import { Avatar } from '../common/Avatar';
import { liveChatManager } from '../../utils/liveChatSync';

export const RoomNotesChat: React.FC<{
  user: UserProfile;
  roomTopic: string;
}> = ({ user, roomTopic }) => {
  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'chat'>('notes');
  const [copied, setCopied] = useState(false);

  // Scratchpad content
  const [notes, setNotes] = useState(
    `# Chamber Scratchpad: ${roomTopic}\n\n` +
      `## Key Concepts Covered:\n` +
      `- Hash Join vs Nested Loop: Hash join builds in-memory hash table on smaller relation (O(N+M)).\n` +
      `- Avoid SELECT * in production: Fetch only indexed attributes.\n` +
      `- B+ Tree Index depth: Typically 3-4 levels for millions of records, reducing I/O drastically.\n\n` +
      `## Code Snippet Example:\n` +
      `\`\`\`sql\n` +
      `EXPLAIN ANALYZE\n` +
      `SELECT u.name, q.title\n` +
      `FROM users u\n` +
      `JOIN quest_logs q ON u.id = q.user_id\n` +
      `WHERE q.status = 'COMPLETED';\n` +
      `\`\`\`\n`
  );

  const [channelMessages, setChannelMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Live Sync with multi-device chat manager
  useEffect(() => {
    const unsub = liveChatManager.subscribeMessages((store) => {
      setChannelMessages(store['sql-joins'] || []);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (activeSubTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [channelMessages.length, activeSubTab]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderName: user.name,
      senderAvatar: user.avatarSeed,
      senderRole: user.roleClass,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputMsg.trim(),
      reactions: []
    };

    liveChatManager.sendMessage('sql-joins', newMsg);
    setInputMsg('');
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadNotes = () => {
    const blob = new Blob([notes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Study-Notes-${roomTopic.replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#070a10] border border-[#1a2333] rounded-card overflow-hidden">
      {/* Sub-Header Switcher */}
      <div className="bg-[#0c1018] border-b border-[#182030] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#101524] p-1 rounded-inner border border-[#1a2335]">
          <button
            onClick={() => setActiveSubTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
              activeSubTab === 'notes'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Collaborative Scratchpad</span>
          </button>
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
              activeSubTab === 'chat'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chamber Chat ({channelMessages.length})</span>
          </button>
        </div>

        {activeSubTab === 'notes' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyNotes}
              className="flex items-center gap-1 px-2.5 py-1 rounded-inner bg-[#111724] border border-[#1b2538] text-xs text-slate-300 hover:text-white transition-colors"
              title="Copy Markdown"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadNotes}
              className="flex items-center gap-1 px-2.5 py-1 rounded-inner bg-[#111724] border border-[#1b2538] text-xs text-slate-300 hover:text-teal-300 transition-colors"
              title="Download Notes as .md"
            >
              <Download className="w-3 h-3" />
              <span>Export .md</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden p-4">
        {activeSubTab === 'notes' ? (
          <div className="h-full flex flex-col">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex-1 w-full bg-[#0a0e17] border border-[#182236] rounded-lg p-4 font-mono text-xs text-slate-200 resize-none focus:outline-none focus:border-teal-500/60 leading-relaxed"
              placeholder="Jot down formulas, algorithm steps, or schema thoughts..."
            />
          </div>
        ) : (
          <div className="h-full flex flex-col justify-between">
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
              {channelMessages.map((m) => (
                <div key={m.id} className="bg-[#0c111c] border border-[#172030] rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar seed={m.senderAvatar} size="sm" />
                      <span className="text-xs font-bold text-slate-200">{m.senderName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{m.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 pl-7 leading-relaxed">{m.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Send a live message to all devices..."
                className="flex-1 bg-[#0c111c] border border-[#182030] focus:border-teal-500 rounded-inner px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className="px-4 py-2 rounded-inner bg-teal-500 hover:bg-teal-400 text-[#070b13] font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
