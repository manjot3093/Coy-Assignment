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
      // Fire confetti cannons
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.6 },
          colors: ['#FF2E75', '#000000', '#ECEBFF', '#FFD0DE'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.6 },
          colors: ['#FF2E75', '#000000', '#ECEBFF', '#10B981'],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-[32px] bg-white border-2 border-black p-6 text-center coy-shadow overflow-hidden flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBF2] text-[#FF2E75] border border-[#FFD0DE] text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Double-Blind Verified
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black tracking-tight text-black mb-1">
          It&apos;s a Match!
        </h2>
        <p className="text-xs text-neutral-600 max-w-xs mb-6 font-medium">
          You and <span className="font-extrabold text-black">{matchedProfile.name}</span> secretly liked each other on Coy.
        </p>

        {/* Dual Avatars with Heart Connector */}
        <div className="relative flex items-center justify-center gap-3 my-2 mb-6">
          {/* User Avatar */}
          <div className="w-20 h-20 rounded-full border-2 border-black shadow-md overflow-hidden bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Heart Badge */}
          <div className="w-10 h-10 rounded-full bg-[#FF2E75] border-2 border-black flex items-center justify-center coy-shadow-sm animate-bounce z-10">
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>

          {/* Match Avatar */}
          <div className="w-20 h-20 rounded-full border-2 border-black shadow-md overflow-hidden bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={matchedProfile.photo}
              alt={matchedProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile info preview */}
        <div className="mb-6 p-3 rounded-2xl bg-[#FAFAFC] border border-neutral-200 w-full text-left text-xs">
          <p className="font-bold text-neutral-900 truncate">{matchedProfile.name}, {matchedProfile.age}</p>
          <p className="text-neutral-500 text-[11px] truncate font-medium">{matchedProfile.collegeOrCity}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={() => onOpenChat(matchedProfile)}
            className="w-full py-3.5 rounded-full bg-[#FF2E75] hover:bg-[#F01E65] border-2 border-black text-black font-extrabold text-xs coy-shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            Send a Message
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs transition-colors"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
};
