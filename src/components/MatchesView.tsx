'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Send, X, Sparkles, CheckCheck } from 'lucide-react';
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

    // Simulated reply
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
      }, 1500);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 overflow-y-auto select-none bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
        <div>
          <h2 className="text-xl font-black text-black flex items-center gap-2">
            Matches & Chats
            {matches.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFEBF2] text-[#FF2E75] font-extrabold border border-[#FFD0DE]">
                {matches.length}
              </span>
            )}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Double-blind mutual connections
          </p>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF5F8] border-2 border-black flex items-center justify-center mb-4 coy-shadow-sm text-[#FF2E75]">
            <Heart className="w-8 h-8 fill-[#FF2E75]" />
          </div>
          <h3 className="text-base font-black text-black mb-1">No Mutual Matches Yet</h3>
          <p className="text-xs text-neutral-500 max-w-xs mb-6 leading-relaxed">
            When you swipe right on someone who has secretly liked you too, they will appear here instantly!
          </p>
          <button
            onClick={() => {
              sound.playPop();
              onBackToDiscover();
            }}
            className="px-6 py-3 rounded-full bg-[#FF2E75] border-2 border-black text-black font-extrabold text-xs coy-shadow-sm hover:opacity-95 transition-all active:scale-95"
          >
            Explore Discover Deck
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Top Horizontal Carousel: "New Matches" */}
          <div>
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-wider mb-3 px-0.5">
              New Mutual Matches
            </h3>
            <div className="flex items-center gap-4 overflow-x-auto pb-3 scrollbar-none">
              {matches.map((match) => (
                <div
                  key={`avatar-${match.id}`}
                  onClick={() => handleOpenChat(match.profile)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
                >
                  {/* Avatar ring with strict bounded dimensions */}
                  <div className="w-18 h-18 rounded-full p-1 bg-[#FF2E75] border-2 border-black coy-shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    <div className="w-15 h-15 rounded-full overflow-hidden border border-white bg-neutral-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={match.profile.photo}
                        alt={match.profile.name}
                        className="w-full h-full object-cover shrink-0"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800 group-hover:text-[#FF2E75] truncate max-w-[70px]">
                    {match.profile.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversations Section */}
          <div>
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-wider mb-2.5 px-0.5">
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
                    className="p-3 rounded-2xl bg-white border-2 border-black/80 hover:border-black hover:coy-shadow-sm transition-all cursor-pointer flex items-center gap-3.5 group shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-300 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={match.profile.photo}
                        alt={match.profile.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#FF2E75] transition-colors truncate">
                          {match.profile.name}
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium">
                          {new Date(match.matchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 truncate font-medium">
                        {lastMsg ? (
                          <span className={lastMsg.sender === 'me' ? 'text-neutral-800' : 'text-[#FF2E75] font-bold'}>
                            {lastMsg.sender === 'me' ? 'You: ' : ''}{lastMsg.text}
                          </span>
                        ) : (
                          <span className="italic text-neutral-400">
                            Mutual match! Say hello to {match.profile.name.split(' ')[0]}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="p-2 rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-[#FF2E75] group-hover:text-black group-hover:border-black group-hover:border transition-all shrink-0">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-[32px] bg-white border-2 border-black coy-shadow overflow-hidden flex flex-col h-[540px]">
            {/* Chat Header */}
            <div className="p-3.5 px-4 bg-white border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FF2E75] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeChatProfile.photo}
                    alt={activeChatProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black text-black leading-tight">
                    {activeChatProfile.name}
                  </h4>
                  <p className="text-[10px] text-emerald-600 font-bold">
                    Mutual crush • Active
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playPop();
                  setActiveChatProfile(null);
                }}
                className="p-1.5 rounded-full bg-neutral-100 text-neutral-500 hover:text-black transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAFAFC]">
              <div className="text-center my-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBF2] border border-[#FFD0DE] text-[#FF2E75] text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  Matched on Coy • Double-blind verified
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 font-medium">
                  Both of you secretly liked each other. Break the ice!
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
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-[#FF2E75] text-black border-2 border-black rounded-br-none coy-shadow-sm font-bold'
                        : 'bg-white text-neutral-900 border border-neutral-300 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-neutral-400 mt-0.5 px-1 font-medium">
                    <span>{msg.time}</span>
                    {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-sky-500" />}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-2 px-3 rounded-2xl bg-white border border-neutral-300 w-16 shadow-xs animate-pulse">
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
              className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeChatProfile.name}...`}
                className="flex-1 px-4 py-2.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-full bg-[#FF2E75] border-2 border-black text-black disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition-all coy-shadow-sm"
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
