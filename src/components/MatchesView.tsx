'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Send, X, Sparkles, MapPin, GraduationCap } from 'lucide-react';
import { MatchRecord, Profile } from '@/lib/types';

interface MatchesViewProps {
  matches: MatchRecord[];
  onBackToDiscover: () => void;
  activeChatProfile: Profile | null;
  setActiveChatProfile: (profile: Profile | null) => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  onBackToDiscover,
  activeChatProfile,
  setActiveChatProfile,
}) => {
  const [messages, setMessages] = useState<Record<string, { sender: 'me' | 'them'; text: string; time: string }[]>>({});
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (profileId: string) => {
    if (!inputText.trim()) return;

    const newMsg = {
      sender: 'me' as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [profileId]: [...(prev[profileId] || []), newMsg],
    }));
    setInputText('');

    // Optional simulated reply after 1.5 seconds for demo polish!
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [profileId]: [
          ...(prev[profileId] || []),
          {
            sender: 'them' as const,
            text: "Hey! So glad we mutually matched on Coy! What are you up to?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Mutual Matches
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-semibold border border-pink-500/30">
              {matches.length}
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Only revealed because you both secretly liked each other.
          </p>
        </div>
      </div>

      {/* Match List */}
      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-neutral-500">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">No Mutual Matches Yet</h3>
          <p className="text-xs text-neutral-400 max-w-xs mb-6">
            Swipe right on profiles in the Discover tab. When someone who already liked you gets liked back, they will appear here!
          </p>
          <button
            onClick={onBackToDiscover}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium text-xs shadow-md shadow-pink-500/20 hover:opacity-95 transition-all"
          >
            Start Swiping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {matches.map((match) => (
            <div
              key={match.id}
              onClick={() => setActiveChatProfile(match.profile)}
              className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 hover:border-pink-500/40 transition-all cursor-pointer flex items-center gap-3.5 group shadow-sm"
            >
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-500/60 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={match.profile.photo}
                    alt={match.profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-neutral-950" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors truncate">
                    {match.profile.name}, {match.profile.age}
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {new Date(match.matchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 truncate mt-0.5">
                  {match.profile.collegeOrCity}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 font-medium border border-pink-500/20">
                    Mutual Match
                  </span>
                  <p className="text-[11px] text-neutral-400 truncate italic">
                    Tap to open chat
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-full bg-neutral-800 text-neutral-400 group-hover:bg-pink-500 group-hover:text-white transition-all shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Chat Modal */}
      {activeChatProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col h-[520px]">
            {/* Chat Header */}
            <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-pink-500/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeChatProfile.photo}
                    alt={activeChatProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {activeChatProfile.name}
                  </h4>
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Mutual crush match
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveChatProfile(null)}
                className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="text-center my-2">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px]">
                  <Sparkles className="w-3 h-3" />
                  You matched with {activeChatProfile.name}!
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Say something nice to break the ice.
                </p>
              </div>

              {/* Message History */}
              {(messages[activeChatProfile.id] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.sender === 'me' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-br-none shadow-sm'
                        : 'bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700/60'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(activeChatProfile.id);
              }}
              className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeChatProfile.name}...`}
                className="flex-1 px-3.5 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
