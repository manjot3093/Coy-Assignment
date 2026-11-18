'use client';

import React from 'react';
import { Compass, Flame, Heart, Sparkles } from 'lucide-react';

export type TabType = 'home' | 'discover' | 'matches';

interface NavigationBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  matchesCount: number;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentTab,
  onSelectTab,
  matchesCount,
}) => {
  return (
    <nav className="w-full bg-neutral-900/90 backdrop-blur-md border-t border-neutral-800/80 px-6 py-2.5 flex items-center justify-around z-30 fixed bottom-0 max-w-md">
      {/* Home Tab */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center gap-1 transition-all duration-200 ${
          currentTab === 'home'
            ? 'text-pink-500 scale-105'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
        aria-label="Home Tab"
      >
        <div className="relative p-1">
          <Compass className="w-6 h-6" strokeWidth={currentTab === 'home' ? 2.5 : 2} />
        </div>
        <span className="text-[11px] font-medium tracking-wide">Home</span>
      </button>

      {/* Discover Tab (Highlighted) */}
      <button
        onClick={() => onSelectTab('discover')}
        className={`flex flex-col items-center gap-1 transition-all duration-200 ${
          currentTab === 'discover'
            ? 'text-pink-500 scale-105'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
        aria-label="Discover Tab"
      >
        <div className="relative p-1">
          <Flame
            className={`w-6 h-6 ${
              currentTab === 'discover' ? 'fill-pink-500 text-pink-500' : ''
            }`}
            strokeWidth={currentTab === 'discover' ? 2.5 : 2}
          />
          {currentTab === 'discover' && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
          )}
        </div>
        <span className="text-[11px] font-semibold tracking-wide">Discover</span>
      </button>

      {/* Matches Tab with Count Badge */}
      <button
        onClick={() => onSelectTab('matches')}
        className={`flex flex-col items-center gap-1 transition-all duration-200 ${
          currentTab === 'matches'
            ? 'text-pink-500 scale-105'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
        aria-label="Matches Tab"
      >
        <div className="relative p-1">
          <Heart
            className={`w-6 h-6 ${
              currentTab === 'matches' ? 'fill-pink-500 text-pink-500' : ''
            }`}
            strokeWidth={currentTab === 'matches' ? 2.5 : 2}
          />
          {matchesCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-lg animate-pulse">
              {matchesCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium tracking-wide">Matches</span>
      </button>
    </nav>
  );
};
