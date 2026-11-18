'use client';

import React from 'react';
import { Compass, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';

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
    <div className="w-full h-[540px] rounded-3xl bg-neutral-900/60 border border-neutral-800 p-8 flex flex-col items-center justify-center text-center shadow-xl">
      <div className="w-20 h-20 rounded-full bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center mb-6 text-pink-400">
        <CheckCircle2 className="w-10 h-10 text-pink-500" />
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">You&apos;re All Caught Up!</h3>
      <p className="text-xs text-neutral-400 max-w-xs mb-8 leading-relaxed">
        You have swiped through all available profiles in your discovery pool. Any profile swiped will never appear again.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {matchesCount > 0 ? (
          <button
            onClick={onGoToMatches}
            className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold text-xs shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 hover:opacity-95 transition-all"
          >
            <Heart className="w-4 h-4 fill-white" />
            View Your Mutual Matches ({matchesCount})
          </button>
        ) : null}

        <button
          onClick={onReset}
          className="w-full py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-neutral-400" />
          Reset Demo Profiles (32 Seeded)
        </button>
      </div>
    </div>
  );
};
