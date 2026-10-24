import React, { useState } from 'react';
import { Users, UserPlus, MessageCircle, Radio, Shield, Sparkles, Check, MessageSquare } from 'lucide-react';
import { GuildMember } from '../../types';
import { Avatar } from '../common/Avatar';

interface FriendsViewProps {
  members: GuildMember[];
  onInviteToStudy: (member: GuildMember) => void;
  onWhisper?: (member: GuildMember) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({ members, onInviteToStudy, onWhisper }) => {
  const [invitedMap, setInvitedMap] = useState<Record<string, boolean>>({});

  const handleInvite = (member: GuildMember) => {
    setInvitedMap((prev) => ({ ...prev, [member.id]: true }));
    onInviteToStudy(member);
    setTimeout(() => {
      setInvitedMap((prev) => ({ ...prev, [member.id]: false }));
    }, 3000);
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1c2944]">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-400" />
            <span>Party Roster & Adventurers</span>
          </h1>
          <p className="text-xs text-slate-400">Collaborate with fellow scholars across your guilds</p>
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-inner bg-[#121c33] hover:bg-[#1a2b4e] text-teal-300 border border-teal-800/40 text-xs font-semibold transition-colors">
          <UserPlus className="w-3.5 h-3.5 text-teal-400" />
          <span>Add Adventurer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => {
          const isInvited = invitedMap[m.id];
          return (
            <div
              key={m.id}
              className="p-4 rounded-card bg-[#0e162b] border border-[#1d2b4a] hover:border-[#283e6a] shadow-panel flex flex-col justify-between transition-all"
            >
              <div className="flex items-start gap-3">
                <Avatar seed={m.avatarSeed} size="lg" showStatus isOnline={m.isOnline} statusColor="bg-teal-400" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white truncate">{m.name}</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800">
                      Lv. {m.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{m.roleClass}</p>

                  <div className="mt-2 text-[10px] font-mono">
                    <span className={`px-1.5 py-0.5 rounded border inline-block ${
                      m.isOnline ? 'text-teal-300 bg-teal-950/60 border-teal-800' : 'text-slate-400 bg-slate-850 border-slate-700'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#17243c] flex items-center gap-2">
                {onWhisper && (
                  <button
                    onClick={() => onWhisper(m)}
                    className="py-1.5 px-3 rounded-inner text-[11px] font-semibold bg-[#111c30] hover:bg-[#172744] text-teal-300 border border-teal-800/40 transition-colors flex items-center justify-center gap-1.5"
                    title={`Whisper to ${m.name}`}
                  >
                    <MessageSquare className="w-3 h-3 text-teal-400" />
                    <span>Whisper</span>
                  </button>
                )}

                <button
                  onClick={() => handleInvite(m)}
                  disabled={isInvited || !m.isOnline}
                  className={`flex-1 py-1.5 px-2 rounded-inner text-[11px] font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                    isInvited
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-[#142340] hover:bg-[#1d325c] text-teal-300 border-teal-700/50 disabled:opacity-40'
                  }`}
                >
                  {isInvited ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Invited!</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-3 h-3 text-teal-400" />
                      <span>Invite to Study</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
