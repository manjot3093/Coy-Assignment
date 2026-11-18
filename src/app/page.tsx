'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Wifi, Battery, Signal } from 'lucide-react';
import { MatchRecord, Profile } from '@/lib/types';
import { sound } from '@/lib/sound';
import { NavigationBar, TabType } from '@/components/NavigationBar';
import { HomeTab } from '@/components/HomeTab';
import { DiscoverTab } from '@/components/DiscoverTab';
import { MatchesView } from '@/components/MatchesView';
import { MatchModal } from '@/components/MatchModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [newMatchProfile, setNewMatchProfile] = useState<Profile | null>(null);
  const [activeChatProfile, setActiveChatProfile] = useState<Profile | null>(null);

  // Fetch mutual matches
  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleSelectTab = (tab: TabType) => {
    sound.playPop();
    setActiveTab(tab);
  };

  // When a mutual match occurs during swipe
  const handleMatch = (profile: Profile) => {
    setNewMatchProfile(profile);
    fetchMatches();
  };

  // Open chat from Match Modal CTA
  const handleOpenChatFromMatch = (profile: Profile) => {
    sound.playPop();
    setNewMatchProfile(null);
    setActiveChatProfile(profile);
    setActiveTab('matches');
  };

  return (
    <main className="flex-1 flex flex-col relative w-full h-screen overflow-hidden bg-neutral-950">
      {/* Simulated Mobile Status Bar (9:41, Cellular, Wifi, Battery) */}
      <div className="w-full px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-neutral-400 select-none z-30 shrink-0">
        <span>9:41</span>
        {/* Dynamic Island pill */}
        <div className="w-24 h-4 rounded-full bg-black border border-neutral-800/80 mx-auto hidden sm:block" />
        <div className="flex items-center gap-1.5 text-neutral-300">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Top Coy App Header */}
      <header className="px-5 py-2.5 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 flex items-center justify-between z-30 shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
            <Flame className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-wider text-white">COY</h1>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                {activeTab === 'discover' ? 'DISCOVER' : activeTab === 'matches' ? 'MATCHES' : 'CRUSHES'}
              </span>
            </div>
            <p className="text-[9px] text-neutral-400 font-medium tracking-tight">Double-blind crush matching</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-neutral-300 font-medium">Encrypted</span>
        </div>
      </header>

      {/* Main Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'home' && (
          <HomeTab onGoToDiscover={() => handleSelectTab('discover')} />
        )}

        {activeTab === 'discover' && (
          <DiscoverTab
            onMatch={handleMatch}
            onGoToMatches={() => handleSelectTab('matches')}
            matchesCount={matches.length}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            onBackToDiscover={() => handleSelectTab('discover')}
            activeChatProfile={activeChatProfile}
            setActiveChatProfile={setActiveChatProfile}
          />
        )}
      </div>

      {/* Celebratory Match Modal Popup */}
      <MatchModal
        matchedProfile={newMatchProfile}
        onClose={() => setNewMatchProfile(null)}
        onOpenChat={handleOpenChatFromMatch}
      />

      {/* Bottom Tab Bar */}
      <NavigationBar
        currentTab={activeTab}
        onSelectTab={handleSelectTab}
        matchesCount={matches.length}
      />
    </main>
  );
}
