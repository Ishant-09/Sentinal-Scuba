import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Minimize2,
  Maximize2,
  Radio,
  Swords,
  Sparkles,
  Smile,
  Shield,
  Check,
  CheckCheck,
  Circle,
  Clock
} from 'lucide-react';
import { GuildMember, UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';

export interface WhisperMessage {
  id: string;
  senderId: 'user' | 'member';
  senderName: string;
  text: string;
  timestamp: string;
  read?: boolean;
}

interface WhisperModalProps {
  member: GuildMember | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onInviteToStudy?: (member: GuildMember) => void;
  onChallengeDuel?: (member: GuildMember) => void;
}

export const WhisperModal: React.FC<WhisperModalProps> = ({
  member,
  isOpen,
  onClose,
  currentUser,
  onInviteToStudy,
  onChallengeDuel
}) => {
  const [messages, setMessages] = useState<WhisperMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Seed tailored initial conversation for the selected member
  useEffect(() => {
    if (!member) return;

    setIsMinimized(false);
    setIsTyping(false);

    // Initial conversation starter based on member identity
    let initialSeed: WhisperMessage[] = [];

    if (member.name.includes('Aviral')) {
      initialSeed = [
        {
          id: 'init-1',
          senderId: 'member',
          senderName: member.name,
          text: `Hey ${currentUser.name.split(' ')[0]}! Ready to tackle that LeetCode graph problem and Python comprehension quest today?`,
          timestamp: '10:14 AM',
          read: true
        },
        {
          id: 'init-2',
          senderId: 'user',
          senderName: currentUser.name,
          text: 'Yeah, just wrapping up the Python Core module now.',
          timestamp: '10:16 AM',
          read: true
        },
        {
          id: 'init-3',
          senderId: 'member',
          senderName: member.name,
          text: 'Awesome! Join the Python chamber whenever you are free, I have some dynamic programming tips to share.',
          timestamp: '10:18 AM',
          read: true
        }
      ];
    } else if (member.name.includes('Eknaath')) {
      initialSeed = [
        {
          id: 'init-1',
          senderId: 'member',
          senderName: member.name,
          text: `${currentUser.name.split(' ')[0]}, check the Boss Arena! Phase 2: The Join Labyrinth is vulnerable to hash joins.`,
          timestamp: '09:45 AM',
          read: true
        },
        {
          id: 'init-2',
          senderId: 'user',
          senderName: currentUser.name,
          text: 'On it! Loading the query execution plan right now.',
          timestamp: '09:50 AM',
          read: true
        },
        {
          id: 'init-3',
          senderId: 'member',
          senderName: member.name,
          text: 'Great. Let me know when you are ready to unleash a coordinated query strike.',
          timestamp: '09:52 AM',
          read: true
        }
      ];
    } else if (member.name.includes('Ajay')) {
      initialSeed = [
        {
          id: 'init-1',
          senderId: 'member',
          senderName: member.name,
          text: `Hey ${currentUser.name.split(' ')[0]}! The study sanctuary session starts soon. Let me know if you need the discrete math induction notes.`,
          timestamp: '11:02 AM',
          read: true
        },
        {
          id: 'init-2',
          senderId: 'user',
          senderName: currentUser.name,
          text: 'Thanks Ajay! I will definitely review them before the proofs quest.',
          timestamp: '11:05 AM',
          read: true
        }
      ];
    } else {
      initialSeed = [
        {
          id: 'init-1',
          senderId: 'member',
          senderName: member.name,
          text: `Greetings ${currentUser.name.split(' ')[0]}! Working on any guild quests or study sessions right now?`,
          timestamp: 'Just now',
          read: true
        }
      ];
    }

    setMessages(initialSeed);

    // Auto focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, [member?.id, currentUser.name]);

  // Scroll to bottom when messages update or typing indicator triggers
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen || !member) return null;

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: WhisperMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: currentUser.name,
      text: content,
      timestamp: timeStr,
      read: false
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setShowEmojiPicker(false);

    // Simulate smart, character-specific reply after delay
    setTimeout(() => {
      setIsTyping(true);
    }, 400);

    setTimeout(() => {
      setIsTyping(false);
      generateMemberReply(content, timeStr);
    }, 1400);
  };

  const generateMemberReply = (userQuery: string, timeStr: string) => {
    const lower = userQuery.toLowerCase();
    let reply = `Sounds like a solid plan, ${currentUser.name.split(' ')[0]}! Keep the momentum going 🔥`;

    if (lower.includes('python') || lower.includes('code') || lower.includes('programming')) {
      reply = `Python list comprehensions and generators make data pipelines super clean! Let me know if you want to pair program on the tricky edge cases.`;
    } else if (lower.includes('boss') || lower.includes('raid') || lower.includes('arena')) {
      reply = `I'm locking in for the Query Devourer raid! Phase 2 boss HP is down to 6,400. Let's finish it before reset ⚔️`;
    } else if (lower.includes('study') || lower.includes('room') || lower.includes('sanctuary')) {
      reply = `I'm in the Study Sanctuary now! Screen sharing the whiteboard if you want to hop in and collaborate.`;
    } else if (lower.includes('duel') || lower.includes('sql') || lower.includes('challenge')) {
      reply = `Challenge accepted! Bring your best SQL index optimization queries 🛡️`;
    } else if (lower.includes('math') || lower.includes('proof')) {
      reply = `Discrete math proofs get easier once you formulate the induction base case clearly. We got this!`;
    } else if (lower.includes('git') || lower.includes('github') || lower.includes('merge')) {
      reply = `Interactive rebase is awesome once you master squash and fixup. Don't worry about merge conflicts, we'll sort them out!`;
    } else if (lower.includes('hey') || lower.includes('hi') || lower.includes('hello')) {
      reply = `Hey ${currentUser.name.split(' ')[0]}! Hope your study grind is going smoothly. Need help with any quest steps?`;
    }

    const replyMsg: WhisperMessage = {
      id: `reply-${Date.now()}`,
      senderId: 'member',
      senderName: member.name,
      text: reply,
      timestamp: timeStr,
      read: true
    };

    setMessages((prev) => [...prev, replyMsg]);
  };

  const quickPrompts = [
    '👋 Free for study session?',
    '⚔️ Ready for Boss Raid?',
    '🐍 Review Python quest',
    '💡 Share study notes'
  ];

  const quickEmojis = ['👍', '🔥', '⚔️', '🚀', '💡', '✨'];

  // Minimized floating pill bar in bottom-right corner
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-200">
        <div className="bg-[#0f172a] border border-teal-500/40 rounded-full shadow-2xl px-3.5 py-2 flex items-center gap-3 backdrop-blur-md">
          <div className="relative">
            <Avatar seed={member.avatarSeed} size="sm" showStatus isOnline={member.isOnline} statusColor="bg-teal-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
          </div>

          <div
            onClick={() => setIsMinimized(false)}
            className="cursor-pointer text-left select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white hover:text-teal-300 transition-colors">
                Whisper: {member.name}
              </span>
              <span className="text-[9px] font-mono text-teal-300 px-1 rounded bg-teal-950/80 border border-teal-700/50">
                Lv. {member.level}
              </span>
            </div>
            <p className="text-[10px] text-teal-400/90 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
              <span>{member.status} • Click to open</span>
            </p>
          </div>

          <div className="flex items-center gap-1 pl-1 border-l border-[#1f2e4d]">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Expand Whisper Window"
              aria-label="Expand whisper window"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
              title="Close Whisper"
              aria-label="Close whisper"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:right-6 sm:bottom-6 z-50 w-[92vw] sm:w-[420px] max-w-full animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-[#0b101b] border border-teal-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] max-h-[85vh] relative backdrop-blur-md">
        
        {/* 1. Sleek MMORPG Header */}
        <div className="p-3 bg-gradient-to-r from-[#0d1627] via-[#101a2e] to-[#0d1627] border-b border-[#1b2842] flex items-center justify-between select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <Avatar seed={member.avatarSeed} size="md" showStatus isOnline={member.isOnline} statusColor="bg-teal-400" />
              {member.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-[#0b101b]" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-white truncate">{member.name}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-950/80 text-teal-300 border border-teal-800/60 font-semibold">
                  Lv. {member.level}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="truncate">{member.roleClass}</span>
                <span>•</span>
                <span className="text-teal-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block animate-pulse" />
                  {member.status}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1 text-slate-400">
            {onInviteToStudy && (
              <button
                onClick={() => onInviteToStudy(member)}
                className="p-1.5 rounded-inner hover:bg-[#15233e] hover:text-teal-300 transition-colors"
                title="Invite to Study Sanctuary"
                aria-label="Invite to study sanctuary"
              >
                <Radio className="w-3.5 h-3.5 text-teal-400" />
              </button>
            )}

            {onChallengeDuel && (
              <button
                onClick={() => onChallengeDuel(member)}
                className="p-1.5 rounded-inner hover:bg-[#15233e] hover:text-rose-400 transition-colors"
                title="Challenge to SQL Duel"
                aria-label="Challenge to duel"
              >
                <Swords className="w-3.5 h-3.5 text-rose-400" />
              </button>
            )}

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-inner hover:bg-[#15233e] hover:text-white transition-colors"
              title="Minimize Whisper"
              aria-label="Minimize whisper window"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-inner hover:bg-[#15233e] hover:text-rose-400 transition-colors"
              title="Close Whisper"
              aria-label="Close whisper window"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Channel Encryption Notice */}
        <div className="bg-[#0e1628]/80 px-3 py-1 text-[10px] font-mono text-slate-400 border-b border-[#18233a] flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-teal-300/90">
            <Shield className="w-3 h-3 text-teal-400" />
            Encrypted Whisper Channel • {member.name.split(' ')[0]}
          </span>
          <span className="text-[9px] text-slate-500">Party Scholar</span>
        </div>

        {/* 2. Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#0a0f19]">
          <div className="text-center my-1">
            <span className="text-[9px] font-mono text-slate-500 px-2 py-0.5 rounded-full bg-[#11192b] border border-[#18233a]">
              Today • Whisper Session Active
            </span>
          </div>

          {messages.map((msg) => {
            const isUser = msg.senderId === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-br-xs'
                      : 'bg-[#121c30] text-slate-200 border border-[#1d2b48] rounded-bl-xs'
                  }`}
                >
                  <p className="break-words select-text">{msg.text}</p>
                </div>

                <div className="flex items-center gap-1 px-1 text-[9px] font-mono text-slate-500">
                  <span>{msg.timestamp}</span>
                  {isUser && (
                    <span className="text-teal-400">
                      <CheckCheck className="w-3 h-3 inline" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#121c30] border border-[#1d2b48] w-fit px-3 py-1.5 rounded-full animate-in fade-in">
              <span className="text-[10px] text-teal-300 font-medium">
                {member.name.split(' ')[0]} is typing
              </span>
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" />
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. Quick Prompt Chips & Emojis */}
        <div className="px-3 pt-2 bg-[#0c1220] border-t border-[#172238] space-y-1.5">
          {/* Quick Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.replace(/^[^\s]+\s/, ''))}
                className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-medium bg-[#111a2f] hover:bg-[#172442] text-slate-300 hover:text-teal-300 border border-[#1c2a47] transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Quick Emoji Bar when toggled */}
          {showEmojiPicker && (
            <div className="flex items-center gap-2 py-1 px-1 bg-[#10192e] rounded-inner border border-[#1b2947] animate-in fade-in">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setInputText((prev) => prev + emoji);
                    inputRef.current?.focus();
                  }}
                  className="hover:scale-125 transition-transform text-sm p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Interactive Input Box */}
        <div className="p-3 bg-[#0c1220] flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-1.5 rounded-inner text-slate-400 hover:text-teal-300 hover:bg-[#141d33] transition-colors"
            title="Add Reaction Emoji"
            aria-label="Add emoji"
          >
            <Smile className="w-4 h-4" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Whisper to @${member.name.split(' ')[0]}...`}
            className="flex-1 bg-[#101728] border border-[#1b2640] rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/60 transition-colors"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white transition-all shadow-md flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            title="Send Whisper (Enter)"
            aria-label="Send whisper message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
