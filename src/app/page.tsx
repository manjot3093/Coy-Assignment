'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Settings, X } from 'lucide-react';
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
  const [showSettings, setShowSettings] = useState(false);

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

  // Mutual match callback
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

  const handleResetFeed = async () => {
    try {
      sound.playPop();
      await fetch('/api/reset', { method: 'POST' });
      await fetchMatches();
      setShowSettings(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-1 flex flex-col relative w-full h-screen overflow-hidden bg-white">
      {/* Top Header - Exact Coy Branding */}
      <header className="px-5 py-3.5 bg-white border-b border-neutral-100 flex items-center justify-between z-30 shrink-0 select-none">
        {/* Left spacer for centering logo */}
        <div className="w-9" />

        {/* Centered Coy. Logo */}
        <div className="flex items-center select-none cursor-pointer" onClick={() => handleSelectTab('home')}>
          <span className="text-2xl font-black tracking-tight text-black font-sans leading-none">
            coy
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E75] ml-0.5 inline-block -mb-2" />
        </div>

        {/* Settings Gear Icon (Right) */}
        <button
          onClick={() => {
            sound.playPop();
            setShowSettings(true);
          }}
          className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 flex items-center justify-center text-neutral-700 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4 stroke-[2]" />
        </button>
      </header>

      {/* Main Tab Views */}
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white border-2 border-black p-6 coy-shadow space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-full bg-neutral-100 text-neutral-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-700">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                <p className="font-bold text-neutral-900">Coy Double-Blind Promise</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Your crushes are stored as encrypted hashes. Nobody ever finds out unless it is mutual.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetFeed}
                  className="w-full py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold border border-neutral-300 transition-colors"
                >
                  Reset Discovery Deck (32 Profiles)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
