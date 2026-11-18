'use client';

import React from 'react';
import { Home, Flame, Heart } from 'lucide-react';

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
    <nav className="w-full bg-white/95 backdrop-blur-md border-t border-neutral-200 px-6 py-2 flex items-center justify-around z-30 fixed bottom-0 max-w-md">
      {/* Home Tab */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center gap-1 transition-all duration-150 ${
          currentTab === 'home'
            ? 'text-[#FF2E75] scale-105'
            : 'text-neutral-400 hover:text-neutral-700'
        }`}
        aria-label="Home Tab"
      >
        <div className="relative p-1">
          <Home
            className="w-5 h-5"
            strokeWidth={currentTab === 'home' ? 2.5 : 2}
          />
        </div>
        <span className="text-[11px] font-bold tracking-tight">Home</span>
      </button>

      {/* Discover Tab */}
      <button
        onClick={() => onSelectTab('discover')}
        className={`flex flex-col items-center gap-1 transition-all duration-150 ${
          currentTab === 'discover'
            ? 'text-[#FF2E75] scale-105'
            : 'text-neutral-400 hover:text-neutral-700'
        }`}
        aria-label="Discover Tab"
      >
        <div className="relative p-1">
          <Flame
            className={`w-5 h-5 ${
              currentTab === 'discover' ? 'fill-[#FF2E75] text-[#FF2E75]' : ''
            }`}
            strokeWidth={currentTab === 'discover' ? 2.5 : 2}
          />
          {currentTab === 'discover' && (
            <span className="absolute 0 top-0.5 right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2E75]"></span>
            </span>
          )}
        </div>
        <span className="text-[11px] font-bold tracking-tight">Discover</span>
      </button>

      {/* Matches Tab */}
      <button
        onClick={() => onSelectTab('matches')}
        className={`flex flex-col items-center gap-1 transition-all duration-150 ${
          currentTab === 'matches'
            ? 'text-[#FF2E75] scale-105'
            : 'text-neutral-400 hover:text-neutral-700'
        }`}
        aria-label="Matches Tab"
      >
        <div className="relative p-1">
          <Heart
            className={`w-5 h-5 ${
              currentTab === 'matches' ? 'fill-[#FF2E75] text-[#FF2E75]' : ''
            }`}
            strokeWidth={currentTab === 'matches' ? 2.5 : 2}
          />
          {matchesCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#FF2E75] text-white text-[10px] font-extrabold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-sm">
              {matchesCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-bold tracking-tight">Matches</span>
      </button>
    </nav>
  );
};
