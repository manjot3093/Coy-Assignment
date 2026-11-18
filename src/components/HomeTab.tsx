'use client';

import React, { useState } from 'react';
import { UserPlus, EyeOff, Heart, Smartphone, X, Flame, ArrowRight, Check } from 'lucide-react';
import { sound } from '@/lib/sound';

interface HomeTabProps {
  onGoToDiscover: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onGoToDiscover }) => {
  const [showAddBanner, setShowAddBanner] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAddCrush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    sound.playPop();
    setAddedSuccess(true);
    setTimeout(() => {
      setShowAddModal(false);
      setPhoneOrEmail('');
      setAddedSuccess(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 overflow-y-auto bg-white select-none">
      {/* 1. Main Coy Hero Card (Matches Screenshot Perfectly) */}
      <div className="w-full rounded-[28px] border-2 border-black bg-white coy-shadow p-5 mb-5 flex flex-col">
        {/* Top Decorative Illustration Header (Lilac Dot Grid with Connected Pink Dots) */}
        <div className="w-full h-28 rounded-2xl bg-[#E8E6FF] flex items-center justify-center p-3 relative overflow-hidden mb-5">
          {/* Subtle Dot Grid */}
          <div className="grid grid-cols-7 gap-x-5 gap-y-3.5 opacity-60">
            {Array.from({ length: 21 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#8F87E0]" />
            ))}
          </div>

          {/* Two Connected Pink Dots in Center */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 pointer-events-none">
            <span className="w-4 h-4 rounded-full bg-[#FF2E75] border-2 border-black shadow-sm" />
            <span className="w-4 h-4 rounded-full bg-[#FF2E75] border-2 border-black shadow-sm" />
          </div>
        </div>

        {/* Card Heading */}
        <h2 className="text-[26px] font-black tracking-tight text-black leading-[1.15] mb-5">
          Find out if your<br />crush likes you back
        </h2>

        {/* 3 Step Features */}
        <div className="space-y-4 mb-6">
          {/* Item 1 */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#F0EFFE] flex items-center justify-center text-[#6355D8] shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-neutral-800 leading-snug">
              Add someone you like, by number or email
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFF2EA] flex items-center justify-center text-[#E06D34] shrink-0">
              <EyeOff className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-neutral-800 leading-snug">
              We tell them someone likes them, not who
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFEBF2] flex items-center justify-center text-[#FF2E75] shrink-0">
              <Heart className="w-4 h-4 fill-[#FF2E75]" />
            </div>
            <p className="text-xs font-semibold text-neutral-800 leading-snug">
              If they add you back, it&apos;s a match
            </p>
          </div>
        </div>

        {/* Main "Add your crushes" Button */}
        <button
          onClick={() => {
            sound.playPop();
            setShowAddModal(true);
          }}
          className="w-full py-3.5 rounded-full bg-[#FF2E75] hover:bg-[#F01E65] active:scale-98 border-2 border-black text-black font-extrabold text-sm tracking-wide transition-all shadow-sm"
        >
          Add your crushes
        </button>
      </div>

      {/* 2. "Add Coy to your home screen" Banner (From Screenshot) */}
      {showAddBanner && (
        <div className="w-full p-3 px-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF2FF] flex items-center justify-center text-[#3B82F6] shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900 leading-tight">
                Add Coy to your home screen
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Open it like an app, in one tap.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => sound.playPop()}
              className="text-xs font-bold text-[#FF2E75] hover:opacity-80"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddBanner(false)}
              className="text-neutral-400 hover:text-neutral-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. "Discover Tab" Bridge Banner */}
      <div
        onClick={() => {
          sound.playPop();
          onGoToDiscover();
        }}
        className="w-full p-3.5 rounded-2xl bg-[#FFF5F8] border border-[#FFD0DE] flex items-center justify-between mb-6 cursor-pointer hover:bg-[#FFEDF3] transition-all group shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF2E75] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-neutral-900">
                Discover Mode
              </p>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-[#FF2E75] text-white">
                New
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 mt-0.5">
              Swipe profiles near Delhi & campuses
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-[#FF2E75] group-hover:translate-x-1 transition-transform" />
      </div>

      {/* 4. "Your crushes" Section (From Screenshot: "Your crushes" with 1/3 pill) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h3 className="text-sm font-black text-black">Your crushes</h3>
          <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-200/80 px-2 py-0.5 rounded-full">
            1/3
          </span>
        </div>

        {/* Existing Crush Card: Ankit Raj +91 91289 13877 */}
        <div className="w-full p-3.5 rounded-2xl bg-[#FAFAFC] border border-neutral-200/80 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Peach Avatar with Initial "A" */}
            <div className="w-10 h-10 rounded-full bg-[#FFE7DB] text-[#C45419] font-black text-sm flex items-center justify-center shrink-0">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 leading-tight">Ankit Raj</p>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">+91 91289 13877</p>
            </div>
          </div>

          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
            Waiting
          </span>
        </div>
      </div>

      {/* Add Crush Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white border-2 border-black p-6 coy-shadow space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">Add a Secret Crush</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full bg-neutral-100 text-neutral-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addedSuccess ? (
              <div className="p-6 text-center text-emerald-600 font-bold text-xs flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span>Encrypted notification sent!</span>
              </div>
            ) : (
              <form onSubmit={handleAddCrush} className="space-y-3">
                <p className="text-xs text-neutral-600">
                  Enter their phone number or email. We send an anonymous heads-up without revealing who added them.
                </p>
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or email"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-[#FF2E75] border-2 border-black text-black text-xs font-extrabold coy-shadow-sm"
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
