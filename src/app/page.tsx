'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { MatchRecord, Profile } from '@/lib/types';
import { NavigationBar, TabType } from '@/components/NavigationBar';
import { HomePlaceholder } from '@/components/HomePlaceholder';
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

  // When a mutual match happens during swipe
  const handleMatch = (profile: Profile) => {
    setNewMatchProfile(profile);
    fetchMatches(); // update match list and badge count immediately
  };

  // Open chat from Match Modal CTA
  const handleOpenChatFromMatch = (profile: Profile) => {
    setNewMatchProfile(null);
    setActiveChatProfile(profile);
    setActiveTab('matches');
  };

  return (
    <main className="flex-1 flex flex-col relative w-full h-screen overflow-hidden">
      {/* Top Header */}
      <header className="px-5 py-3.5 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center shadow-md shadow-pink-500/20">
            <Flame className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-wider text-white">COY</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                DISCOVER
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-medium">Double-blind crush matching</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-neutral-300">Live Demo</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'home' && (
          <HomePlaceholder onGoToDiscover={() => setActiveTab('discover')} />
        )}

        {activeTab === 'discover' && (
          <DiscoverTab
            onMatch={handleMatch}
            onGoToMatches={() => setActiveTab('matches')}
            matchesCount={matches.length}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            onBackToDiscover={() => setActiveTab('discover')}
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

      {/* Persistent Bottom Tab Bar */}
      <NavigationBar
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        matchesCount={matches.length}
      />
    </main>
  );
}
