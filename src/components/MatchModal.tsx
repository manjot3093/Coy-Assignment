'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, MessageCircle, X, Sparkles } from 'lucide-react';
import { Profile } from '@/lib/types';

interface MatchModalProps {
  matchedProfile: Profile | null;
  onClose: () => void;
  onOpenChat: (profile: Profile) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  matchedProfile,
  onClose,
  onOpenChat,
}) => {
  useEffect(() => {
    if (matchedProfile) {
      // Fire celebratory confetti cannons
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.6 },
          colors: ['#FF3366', '#FF6B6B', '#7928CA', '#F59E0B'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.6 },
          colors: ['#FF3366', '#FF6B6B', '#7928CA', '#10B981'],
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [matchedProfile]);

  if (!matchedProfile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-700/80 p-6 text-center shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Glow backdrop behind avatars */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Double-Blind Verified
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent mb-1">
          It&apos;s a Match!
        </h2>
        <p className="text-xs text-neutral-300 max-w-xs mb-6">
          You and <span className="font-semibold text-white">{matchedProfile.name}</span> secretly liked each other.
        </p>

        {/* Dual Avatars with Heart Connection */}
        <div className="relative flex items-center justify-center gap-3 my-2 mb-6">
          {/* User Avatar */}
          <div className="w-20 h-20 rounded-full border-4 border-neutral-800 shadow-xl overflow-hidden bg-neutral-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Heart Badge Floating Between */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 border-2 border-white flex items-center justify-center shadow-lg animate-bounce z-10">
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>

          {/* Match Avatar */}
          <div className="w-20 h-20 rounded-full border-4 border-pink-500 shadow-xl overflow-hidden bg-neutral-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={matchedProfile.photo}
              alt={matchedProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile snippet */}
        <div className="mb-6 p-2.5 rounded-xl bg-neutral-800/50 border border-neutral-700/60 w-full text-left text-xs">
          <p className="font-medium text-white truncate">{matchedProfile.name}, {matchedProfile.age}</p>
          <p className="text-neutral-400 text-[11px] truncate">{matchedProfile.collegeOrCity}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={() => onOpenChat(matchedProfile)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-pink-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            Send a Message
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs transition-colors"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
};
