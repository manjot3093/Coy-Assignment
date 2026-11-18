'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Heart, SlidersHorizontal, Keyboard, Loader2, RotateCcw, ShieldCheck } from 'lucide-react';
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

      // Play soft sound & haptic vibration
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

  // Keyboard navigation (Left = Pass, Right = Like)
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
    <div className="flex-1 flex flex-col items-center justify-between p-4 pb-24 w-full select-none bg-white">
      {/* Top Status Bar with Count & Filter */}
      <div className="w-full flex items-center justify-between mb-3 px-1 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-neutral-800">
          <span className="w-2 h-2 rounded-full bg-[#FF2E75]" />
          <span>
            {profiles.length > 0
              ? `${profiles.length} profiles to explore`
              : 'Deck completed'}
          </span>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setShowFilters(true);
          }}
          className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-700 transition-colors"
          title="Discovery Settings"
          aria-label="Discovery Settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Card Deck Area */}
      <div className="relative w-full max-w-sm h-[530px] flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 text-neutral-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF2E75]" />
            <p className="text-xs font-semibold">Finding matches near you...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-3xl bg-neutral-50 border-2 border-black coy-shadow text-center text-xs text-neutral-800">
            <p className="font-bold mb-2">Error loading discovery</p>
            <p className="mb-4 text-neutral-500">{error}</p>
            <button
              onClick={fetchFeed}
              className="px-5 py-2.5 rounded-full bg-[#FF2E75] border-2 border-black text-black font-extrabold text-xs"
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
            {/* Background Card */}
            {profiles.length > 1 && (
              <SwipeCard
                key={profiles[1].id}
                profile={profiles[1]}
                onSwipe={handleSwipe}
                isFront={false}
              />
            )}

            {/* Front Card */}
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

      {/* Action Buttons (Neo-brutalist: border-2 border-black, solid shadows) */}
      {profiles.length > 0 && !loading && (
        <div className="w-full max-w-xs flex flex-col items-center gap-2 mt-3">
          <div className="flex items-center justify-center gap-8">
            {/* Pass Button */}
            <button
              onClick={() => handleSwipe('pass')}
              disabled={swiping}
              className="w-14 h-14 rounded-full bg-white border-2 border-black flex items-center justify-center text-black coy-shadow-sm hover:scale-108 active:scale-95 transition-all disabled:opacity-40"
              aria-label="Pass profile (Left Arrow)"
              title="Pass (Left Arrow)"
            >
              <X className="w-7 h-7 stroke-[3]" />
            </button>

            {/* Like Button */}
            <button
              onClick={() => handleSwipe('like')}
              disabled={swiping}
              className="w-16 h-16 rounded-full bg-[#FF2E75] border-2 border-black flex items-center justify-center text-black coy-shadow-sm hover:scale-108 active:scale-95 transition-all disabled:opacity-40"
              aria-label="Like profile (Right Arrow)"
              title="Like (Right Arrow)"
            >
              <Heart className="w-8 h-8 fill-black" />
            </button>
          </div>

          {/* Desktop Keyboard Helper Hint */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium mt-0.5">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Use Left / Right arrow keys to swipe</span>
          </div>
        </div>
      )}

      {/* Discovery Settings Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white border-2 border-black p-6 coy-shadow space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">Discovery Settings</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 rounded-full bg-neutral-100 text-neutral-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-700">
              <div className="flex items-center justify-between">
                <span>Maximum Distance</span>
                <span className="font-extrabold text-[#FF2E75]">25 km</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Age Preference</span>
                <span className="font-extrabold text-[#FF2E75]">19 – 25</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-2.5 text-neutral-600 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Double-blind guarantee active. No one will ever know you liked them unless they like you too.
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold border border-neutral-300 flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Swiped Profiles (32 Seeded)
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-2.5 rounded-full bg-[#FF2E75] border-2 border-black text-black text-xs font-extrabold coy-shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
