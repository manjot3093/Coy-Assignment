'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Send, X, Sparkles, MapPin, GraduationCap, CheckCheck } from 'lucide-react';
import { MatchRecord, Profile } from '@/lib/types';
import { sound } from '@/lib/sound';

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
  const [isTyping, setIsTyping] = useState(false);

  const handleOpenChat = (profile: Profile) => {
    sound.playPop();
    setActiveChatProfile(profile);
  };

  const handleSendMessage = (profileId: string) => {
    if (!inputText.trim()) return;

    sound.playPop();
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

    // Realistic simulated typing indicator and friendly response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => ({
          ...prev,
          [profileId]: [
            ...(prev[profileId] || []),
            {
              sender: 'them' as const,
              text: "Hey! So glad we both liked each other on Coy! What are you up to this weekend?",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
        }));
        sound.playPop();
      }, 1600);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Matches & Chats
            {matches.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-bold border border-pink-500/30">
                {matches.length}
              </span>
            )}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Double-blind mutual connections
          </p>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
          <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-neutral-500 shadow-inner">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Mutual Matches Yet</h3>
          <p className="text-xs text-neutral-400 max-w-xs mb-6 leading-relaxed">
            When you swipe right on someone who has secretly liked you too, they will appear here instantly!
          </p>
          <button
            onClick={() => {
              sound.playPop();
              onBackToDiscover();
            }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold text-xs shadow-md shadow-pink-500/20 hover:opacity-95 transition-all active:scale-95"
          >
            Explore Discover Deck
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Top Horizontal Carousel: "New Matches" */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5 px-1">
              New Mutual Matches
            </h3>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {matches.map((match) => (
                <div
                  key={`avatar-${match.id}`}
                  onClick={() => handleOpenChat(match.profile)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
                >
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-500 shadow-md group-hover:scale-105 transition-transform">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-neutral-950 bg-neutral-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={match.profile.photo}
                        alt={match.profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-neutral-950" />
                  </div>
                  <span className="text-[11px] font-medium text-neutral-200 group-hover:text-pink-400 truncate max-w-[64px]">
                    {match.profile.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversations Section */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5 px-1">
              Conversations
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {matches.map((match) => {
                const userMsgs = messages[match.profile.id] || [];
                const lastMsg = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1] : null;

                return (
                  <div
                    key={match.id}
                    onClick={() => handleOpenChat(match.profile)}
                    className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:border-pink-500/40 transition-all cursor-pointer flex items-center gap-3.5 group shadow-sm active:scale-98"
                  >
                    <div className="relative shrink-0">
                      <div className="w-13 h-13 rounded-2xl overflow-hidden border border-neutral-700 shadow-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={match.profile.photo}
                          alt={match.profile.name}
                          className="w-13 h-13 object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors truncate">
                          {match.profile.name}
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium">
                          {new Date(match.matchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate">
                        {lastMsg ? (
                          <span className={lastMsg.sender === 'me' ? 'text-neutral-300' : 'text-pink-300 font-medium'}>
                            {lastMsg.sender === 'me' ? 'You: ' : ''}{lastMsg.text}
                          </span>
                        ) : (
                          <span className="italic text-neutral-400">
                            Mutual crush! Say hello to {match.profile.name.split(' ')[0]}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="p-2 rounded-full bg-neutral-800 text-neutral-400 group-hover:bg-pink-500 group-hover:text-white transition-all shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Chat Modal */}
      {activeChatProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-[32px] bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col h-[540px]">
            {/* Chat Header */}
            <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500/70">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeChatProfile.photo}
                      alt={activeChatProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-neutral-950" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {activeChatProfile.name}
                  </h4>
                  <p className="text-[10px] text-emerald-400 font-medium">
                    Mutual crush • Active now
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playPop();
                  setActiveChatProfile(null);
                }}
                className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="text-center my-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px]">
                  <Sparkles className="w-3 h-3" />
                  Matched on Coy • Double-blind verified
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Both of you secretly swiped right. Break the ice!
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
                  <div className="flex items-center gap-1 text-[9px] text-neutral-400 mt-0.5 px-1">
                    <span>{msg.time}</span>
                    {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-sky-400" />}
                  </div>
                </div>
              ))}

              {/* Typing indicator bubble */}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-neutral-800 border border-neutral-700/50 w-16 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
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
                className="flex-1 px-4 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition-all shadow-md shadow-pink-500/20"
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
