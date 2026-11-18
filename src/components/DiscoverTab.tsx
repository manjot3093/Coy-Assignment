'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Heart, SlidersHorizontal, Sparkles, Keyboard, Loader2, RotateCcw, ShieldCheck } from 'lucide-react';
import { Profile, SwipeAction } from '@/lib/types';
import { sound } from '@/lib/sound';
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
  const [showFilters, setShowFilters] = useState(false);

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

  // Handle Swipe
  const handleSwipe = useCallback(
    async (action: SwipeAction) => {
      if (profiles.length === 0 || swiping) return;

      const currentProfile = profiles[0];
      setSwiping(true);

      // Play soft tactile sound & haptic vibration
      sound.playSwipe(action);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }

      // Optimistically remove card
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
          sound.playMatchChime();
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

  // Keyboard accessibility listeners (Left = Pass, Right = Like)
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
      sound.playPop();
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchFeed();
        setShowFilters(false);
      }
    } catch (err) {
      console.error('Error resetting feed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 pb-24 w-full select-none">
      {/* Top Status Bar with Filter Toggle */}
      <div className="w-full flex items-center justify-between mb-3 px-1 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-medium text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {profiles.length > 0
                ? `${profiles.length} nearby`
                : 'Discovery complete'}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setShowFilters(true);
          }}
          className="p-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title="Preferences & Reset"
          aria-label="Discovery Preferences"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Card Deck Area */}
      <div className="relative w-full max-w-sm h-[550px] flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            <p className="text-xs">Finding people near your university...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-3xl bg-neutral-900 border border-rose-900/60 text-center text-xs text-rose-300">
            <p className="font-semibold mb-2">Error loading discovery</p>
            <p className="mb-4 text-neutral-400">{error}</p>
            <button
              onClick={fetchFeed}
              className="px-4 py-2 rounded-full bg-pink-500 text-white font-medium"
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
            {/* Background Preview Card for Depth */}
            {profiles.length > 1 && (
              <SwipeCard
                key={profiles[1].id}
                profile={profiles[1]}
                onSwipe={handleSwipe}
                isFront={false}
              />
            )}

            {/* Top Interactive Front Card */}
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
          <div className="flex items-center justify-center gap-8">
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
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Use Left / Right arrow keys to swipe</span>
          </div>
        </div>
      )}

      {/* Preferences & Reset Drawer Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">Discovery Settings</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Distance Radius</span>
                <span className="font-semibold text-pink-400">Within 25 km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Age Range</span>
                <span className="font-semibold text-pink-400">19 – 25</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-2.5 text-neutral-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Double-blind guarantee active. Profiles will never know you swiped on them unless mutual.
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Discovery History (32 Profiles)
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-semibold"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
