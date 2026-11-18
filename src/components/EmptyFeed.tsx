'use client';

import React from 'react';
import { RotateCcw, Heart, CheckCircle2 } from 'lucide-react';

interface EmptyFeedProps {
  onReset: () => void;
  onGoToMatches: () => void;
  matchesCount: number;
}

export const EmptyFeed: React.FC<EmptyFeedProps> = ({
  onReset,
  onGoToMatches,
  matchesCount,
}) => {
  return (
    <div className="w-full h-[530px] rounded-[30px] bg-white border-2 border-black coy-shadow p-8 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-[#FFEBF2] text-[#FF2E75] border-2 border-black flex items-center justify-center mb-5 coy-shadow-sm">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-black text-black mb-2">You&apos;re All Caught Up!</h3>
      <p className="text-xs text-neutral-600 max-w-xs mb-8 leading-relaxed">
        You have swiped through all available profiles in your discovery pool. Any profile swiped will never appear again.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {matchesCount > 0 ? (
          <button
            onClick={onGoToMatches}
            className="w-full py-3.5 rounded-full bg-[#FF2E75] border-2 border-black text-black font-extrabold text-xs coy-shadow-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all"
          >
            <Heart className="w-4 h-4 fill-black" />
            View Your Mutual Matches ({matchesCount})
          </button>
        ) : null}

        <button
          onClick={onReset}
          className="w-full py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs border border-neutral-300 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-neutral-600" />
          Reset Discovery Deck (32 Profiles)
        </button>
      </div>
    </div>
  );
};
