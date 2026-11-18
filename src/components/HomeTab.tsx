'use client';

import React, { useState } from 'react';
import { Flame, Lock, Plus, Share2, Shield, Sparkles, UserCheck, Heart, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/sound';

interface HomeTabProps {
  onGoToDiscover: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onGoToDiscover }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addedCrush, setAddedCrush] = useState(false);

  const handleAddCrush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    sound.playPop();
    setAddedCrush(true);
    setTimeout(() => {
      setShowAddModal(false);
      setPhoneNumber('');
      setAddedCrush(false);
    }, 1400);
  };

  return (
    <div className="flex-1 flex flex-col p-5 pb-24 overflow-y-auto">
      {/* Top Welcome Section */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-extrabold text-white">Your Secret Crushes</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            100% Double-blind encrypted & anonymous.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>Encrypted</span>
        </div>
      </div>

      {/* Featured Discover Banner */}
      <div
        onClick={onGoToDiscover}
        className="p-4 rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/15 to-neutral-900 border border-pink-500/30 mb-6 cursor-pointer hover:border-pink-500/60 transition-all group shadow-lg shadow-pink-500/5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-500/30 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                  New: Discover Tab
                </h4>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-pink-500 text-white">
                  Live
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Swipe profiles near your university
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Slots Status Card */}
      <div className="p-4 rounded-3xl bg-neutral-900/80 border border-neutral-800 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral-300">Crush Slots</span>
          <span className="text-xs font-bold text-pink-400">3 of 5 Available</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden mb-4">
          <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 w-[60%]" />
        </div>

        {/* Existing Mock Crushes in List */}
        <div className="space-y-2.5">
          <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <div>
                <p className="font-mono text-neutral-200">+91 98*** ***12</p>
                <p className="text-[10px] text-neutral-400">Anonymous notification sent</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Awaiting Match
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <div>
                <p className="font-mono text-neutral-200">a***@du.ac.in</p>
                <p className="text-[10px] text-neutral-400">Hashed email link verified</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Awaiting Match
            </span>
          </div>
        </div>

        {/* Add Crush Button */}
        <button
          onClick={() => {
            sound.playPop();
            setShowAddModal(true);
          }}
          className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold text-xs shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Another Secret Crush
        </button>
      </div>

      {/* Invite Friends Referral Card */}
      <div className="p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between text-xs mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-white">Unlock Extra Slots</p>
            <p className="text-[11px] text-neutral-400">Invite 2 friends to earn 1 free crush slot</p>
          </div>
        </div>
        <button
          onClick={() => sound.playPop()}
          className="px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium border border-neutral-700"
        >
          Copy Link
        </button>
      </div>

      {/* How it works info */}
      <div className="p-4 rounded-3xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>The Coy Double-Blind Guarantee</span>
        </div>
        <p className="leading-relaxed">
          Your crush will receive an anonymous heads-up via WhatsApp or SMS. They will never know who added them unless they independently add you back too.
        </p>
      </div>

      {/* Add Crush Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">Add a Secret Crush</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Enter their phone number or college email. Only you will see this.
            </p>

            {addedCrush ? (
              <div className="p-6 text-center text-emerald-400 font-medium text-xs flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <span>Encrypted & anonymous heads-up queued!</span>
              </div>
            ) : (
              <form onSubmit={handleAddCrush} className="space-y-3">
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or email"
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-2xl bg-neutral-800 text-neutral-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-semibold shadow-md shadow-pink-500/20"
                  >
                    Add Secretly
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
