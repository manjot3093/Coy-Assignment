'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Heart, RotateCcw, Sparkles, Keyboard, Loader2 } from 'lucide-react';
import { Profile, SwipeAction } from '@/lib/types';
import { SwipeCard } from './SwipeCard';
import { EmptyFeed } from './EmptyFeed';

interface DiscoverTabProps {
  onMatch: (profile: Profile) => void;
  onGoToMatches: () => void;
  matchesCount: number;
}

export const DiscoverTab: React.FC<DiscoverTabProps> = ({
  onMatch,
  onGoToMatches,
  matchesCount,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch unswiped profiles
  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles);
      } else {
        setError(data.error || 'Failed to load profiles');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching profiles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Handle Swipe (Like or Pass)
  const handleSwipe = useCallback(
    async (action: SwipeAction) => {
      if (profiles.length === 0 || swiping) return;

      const currentProfile = profiles[0];
      setSwiping(true);

      // Optimistically remove card from top of stack for instant responsiveness
      setProfiles((prev) => prev.slice(1));

      try {
        const res = await fetch('/api/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileId: currentProfile.id,
            action,
          }),
        });

        const data = await res.json();

        if (data.success && data.match && data.profile) {
          // Trigger match modal callback!
          onMatch(data.profile);
        }
      } catch (err) {
        console.error('Error posting swipe:', err);
      } finally {
        setSwiping(false);
      }
    },
    [profiles, swiping, onMatch]
  );

  // Keyboard accessibility listeners (Left Arrow = Pass, Right Arrow = Like)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (profiles.length === 0 || swiping) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe('pass');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe('like');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe, profiles.length, swiping]);

  // Reset feed handler
  const handleReset = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchFeed();
      }
    } catch (err) {
      console.error('Error resetting feed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 pb-24 w-full">
      {/* Top Status Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1 text-xs text-neutral-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>
            {profiles.length > 0
              ? `${profiles.length} profiles to explore`
              : 'Feed completed'}
          </span>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 hover:text-white transition-colors text-[11px] px-2 py-1 rounded-md bg-neutral-900 border border-neutral-800"
          title="Reset 32 seed profiles for demo"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Feed</span>
        </button>
      </div>

      {/* Main Card Deck Area */}
      <div className="relative w-full max-w-sm h-[540px] flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            <p className="text-xs">Finding matches near you...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-center text-xs text-rose-300">
            <p className="font-semibold mb-2">Error loading feed</p>
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchFeed}
              className="px-4 py-2 rounded-full bg-rose-600 text-white font-medium"
            >
              Retry
            </button>
          </div>
        ) : profiles.length === 0 ? (
          <EmptyFeed
            onReset={handleReset}
            onGoToMatches={onGoToMatches}
            matchesCount={matchesCount}
          />
        ) : (
          <AnimatePresence>
            {/* Render 2nd card in background for tactile depth */}
            {profiles.length > 1 && (
              <SwipeCard
                key={profiles[1].id}
                profile={profiles[1]}
                onSwipe={handleSwipe}
                isFront={false}
              />
            )}

            {/* Front Card with active drag and gesture handling */}
            {profiles.length > 0 && (
              <SwipeCard
                key={profiles[0].id}
                profile={profiles[0]}
                onSwipe={handleSwipe}
                isFront={true}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Desktop / Manual Action Buttons (Pass & Like) */}
      {profiles.length > 0 && !loading && (
        <div className="w-full max-w-xs flex flex-col items-center gap-2 mt-4">
          <div className="flex items-center justify-center gap-6">
            {/* Pass Button */}
            <button
              onClick={() => handleSwipe('pass')}
              disabled={swiping}
              className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-700/80 flex items-center justify-center text-rose-400 shadow-xl hover:bg-rose-500/10 hover:border-rose-500/60 hover:scale-110 active:scale-95 transition-all disabled:opacity-40"
              aria-label="Pass profile (Left Arrow)"
              title="Pass (Left Arrow)"
            >
              <X className="w-7 h-7 stroke-[2.5]" />
            </button>

            {/* Like Button */}
            <button
              onClick={() => handleSwipe('like')}
              disabled={swiping}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-2xl shadow-pink-500/30 hover:scale-110 active:scale-95 transition-all disabled:opacity-40"
              aria-label="Like profile (Right Arrow)"
              title="Like (Right Arrow)"
            >
              <Heart className="w-8 h-8 fill-white" />
            </button>
          </div>

          {/* Desktop Keyboard Helper Hint */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-400 mt-1">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Use Left / Right arrow keys to swipe</span>
          </div>
        </div>
      )}
    </div>
  );
};
