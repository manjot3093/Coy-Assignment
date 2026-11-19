'use client';

import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  EyeOff,
  Heart,
  Smartphone,
  X,
  Flame,
  ArrowRight,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Clock,
  ExternalLink,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '@/lib/sound';
import { CrushRecord, RelationshipTag } from '@/lib/types';

interface HomeTabProps {
  onGoToDiscover: () => void;
}

const RELATIONSHIP_OPTIONS: {
  id: RelationshipTag;
  label: string;
  icon: string;
  preview: string;
}[] = [
  {
    id: 'college',
    label: 'College / University',
    icon: '🎓',
    preview: 'Someone from your college / university added you as their crush on Coy!',
  },
  {
    id: 'mutual_friends',
    label: 'Mutual Friends',
    icon: '👥',
    preview: 'Someone you met through mutual friends added you as their crush on Coy!',
  },
  {
    id: 'event',
    label: 'Event / Party',
    icon: '🎉',
    preview: 'Someone you met at an event / social gathering added you as their crush on Coy!',
  },
  {
    id: 'work',
    label: 'Colleague / Work',
    icon: '💼',
    preview: 'Someone from your work / professional circle added you as their crush on Coy!',
  },
  {
    id: 'contacts',
    label: 'Contacts / Circle',
    icon: '📱',
    preview: 'Someone from your contacts added you as their crush on Coy!',
  },
];

export const HomeTab: React.FC<HomeTabProps> = ({ onGoToDiscover }) => {
  const [showAddBanner, setShowAddBanner] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTeaserModal, setShowTeaserModal] = useState<CrushRecord | null>(null);

  // Crush Form state
  const [crushName, setCrushName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [selectedTag, setSelectedTag] = useState<RelationshipTag>('college');
  const [submitting, setSubmitting] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Crushes data from backend
  const [crushes, setCrushes] = useState<CrushRecord[]>([]);
  const [maxSlots, setMaxSlots] = useState(3);
  const [usedSlots, setUsedSlots] = useState(1);
  const [availableSlots, setAvailableSlots] = useState(2);
  const [loading, setLoading] = useState(true);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Fetch crushes from API
  const fetchCrushes = async () => {
    try {
      const res = await fetch('/api/crushes');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCrushes(data.crushes || []);
          setMaxSlots(data.maxSlots ?? 3);
          setUsedSlots(data.usedSlots ?? 1);
          setAvailableSlots(data.availableSlots ?? 2);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch crushes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrushes();
  }, []);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  };

  // Add new crush with Context Clue
  const handleAddCrush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/crushes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: crushName.trim() || 'Secret Crush',
          contact: phoneOrEmail.trim(),
          tag: selectedTag,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Could not add crush.');
        return;
      }

      sound.playPop();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF2E75', '#8F87E0', '#FFBD38'],
      });

      setAddedSuccess(true);
      fetchCrushes();

      setTimeout(() => {
        setShowAddModal(false);
        setCrushName('');
        setPhoneOrEmail('');
        setSelectedTag('college');
        setAddedSuccess(false);
        showToast('Secret crush added with privacy-safe relationship context!');
      }, 1200);
    } catch (err) {
      showToast('Network error while adding crush.');
    } finally {
      setSubmitting(false);
    }
  };

  // Feature 2: Simulate 45-day cooldown expiry
  const handleSimulateExpiry = async (crushId: string) => {
    try {
      sound.playPop();
      const res = await fetch('/api/crushes/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crushId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCrushes();
        showToast('⚡ Simulated 45 days: Slot is now expired and ready to reclaim!');
      }
    } catch (err) {
      showToast('Failed to simulate expiry.');
    }
  };

  // Feature 2: Reclaim expired slot back into user quota
  const handleReclaimSlot = async (crushId: string) => {
    try {
      sound.playPop();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#FF2E75', '#3B82F6'],
      });

      const res = await fetch('/api/crushes/reclaim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crushId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCrushes();
        showToast('♻️ Slot reclaimed! +1 crush slot returned to your available quota.');
      }
    } catch (err) {
      showToast('Failed to reclaim slot.');
    }
  };

  const activeTagPreview =
    RELATIONSHIP_OPTIONS.find((t) => t.id === selectedTag)?.preview ||
    'Someone added you as their crush on Coy!';

  return (
    <div className="flex-1 flex flex-col p-4 pb-28 overflow-y-auto bg-white select-none relative">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-black text-white text-xs font-bold shadow-lg animate-fadeIn flex items-center gap-2 border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-[#FF2E75]" />
          <span>{feedbackToast}</span>
        </div>
      )}

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
          disabled={availableSlots === 0}
          className={`w-full py-3.5 rounded-full border-2 border-black text-black font-extrabold text-sm tracking-wide transition-all shadow-sm ${
            availableSlots > 0
              ? 'bg-[#FF2E75] hover:bg-[#F01E65] active:scale-98'
              : 'bg-neutral-200 text-neutral-500 cursor-not-allowed border-neutral-300'
          }`}
        >
          {availableSlots > 0 ? 'Add your crushes' : 'All 3 Crush Slots Active'}
        </button>
      </div>

      {/* 2. "Add Coy to your home screen" Banner (From Screenshot) */}
      {showAddBanner && (
        <div className="w-full p-3 px-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex items-center justify-between mb-5">
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
              <p className="text-xs font-bold text-neutral-900">Discover Mode</p>
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

      {/* 4. "Your crushes" Section with Slot Lifecycle Management */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-black">Your crushes</h3>
            <span className="text-[10px] font-semibold text-neutral-500">
              ({availableSlots} slot{availableSlots === 1 ? '' : 's'} available)
            </span>
          </div>

          {/* Dynamic Reactive Quota Badge */}
          <span
            className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
              usedSlots >= maxSlots
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-neutral-100 text-neutral-800 border-neutral-300'
            }`}
          >
            {usedSlots}/{maxSlots}
          </span>
        </div>

        {/* Feature 2 Notice Pill */}
        {usedSlots >= maxSlots && (
          <div className="p-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200/80 mb-3 text-[11px] text-amber-800 flex items-center justify-between">
            <span className="font-medium">
              Crush slots full. Simulate 45d expiry below to reclaim a slot!
            </span>
            <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          </div>
        )}

        {/* Crush Cards List */}
        <div className="space-y-3">
          {crushes.map((c) => {
            const isWaiting = c.status === 'waiting';
            const isExpired = c.status === 'expired';
            const isReclaimed = c.status === 'reclaimed';
            const daysLeft = Math.max(0, (c.cooldownDays || 45) - (c.daysActive || 0));

            return (
              <div
                key={c.id}
                className={`w-full p-4 rounded-2xl border transition-all ${
                  isReclaimed
                    ? 'bg-neutral-50/70 border-neutral-200 opacity-60'
                    : isExpired
                    ? 'bg-amber-50/60 border-amber-300 shadow-sm'
                    : 'bg-[#FAFAFC] border-neutral-200/90 shadow-xs'
                }`}
              >
                {/* Top Row: Avatar, Name, Contact, Status Badge */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    {/* Pastel Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full font-black text-sm flex items-center justify-center shrink-0 border border-black/10 ${
                        isReclaimed
                          ? 'bg-neutral-200 text-neutral-500'
                          : 'bg-[#FFE7DB] text-[#C45419]'
                      }`}
                    >
                      {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-neutral-900 leading-tight">
                          {c.name}
                        </p>
                        {/* Feature 1: Context Clue Pill */}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F0EFFE] text-[#6355D8] border border-[#DCD9FA] flex items-center gap-1">
                          <span>{c.tagIcon || '🎓'}</span>
                          <span>{c.tagLabel || 'College'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-medium mt-0.5">
                        {c.contact}
                      </p>
                    </div>
                  </div>

                  {/* Status Pill */}
                  {isWaiting && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full shrink-0">
                      Waiting
                    </span>
                  )}
                  {isExpired && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-full shrink-0 animate-pulse">
                      Cooldown Expired
                    </span>
                  )}
                  {isReclaimed && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                      Reclaimed
                    </span>
                  )}
                </div>

                {/* Bottom Row: Cooldown Status & Action Controls */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-2">
                  {/* Cooldown Information */}
                  {isWaiting && (
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{daysLeft} days remaining in anti-spam cooldown</span>
                    </div>
                  )}
                  {isExpired && (
                    <div className="text-[11px] font-semibold text-amber-800">
                      45 days inactive · Recipient did not join
                    </div>
                  )}
                  {isReclaimed && (
                    <div className="text-[11px] text-neutral-400 italic">
                      Slot recycled back to your quota
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-auto">
                    {/* View Anonymous Teaser */}
                    <button
                      onClick={() => setShowTeaserModal(c)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Inspect anonymous notification preview"
                    >
                      <EyeOff className="w-3 h-3" />
                      <span>Teaser</span>
                    </button>

                    {/* Feature 2 Button 1: Simulate 45d Expiry */}
                    {isWaiting && (
                      <button
                        onClick={() => handleSimulateExpiry(c.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#FFF2EA] hover:bg-[#FFE4D5] text-[#D4591D] text-[11px] font-bold flex items-center gap-1 transition-colors border border-[#FFDEC9]"
                        title="Fast forward 45 days to test slot reclamation"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Simulate 45d</span>
                      </button>
                    )}

                    {/* Feature 2 Button 2: Reclaim Slot CTA */}
                    {isExpired && (
                      <button
                        onClick={() => handleReclaimSlot(c.id)}
                        className="px-3 py-1 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all border border-black"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Reclaim Slot (+1)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature 1 & 2 Explanation Footer Callout */}
      <div className="w-full p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-600 space-y-2 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-black text-neutral-900">
          <ShieldCheck className="w-4 h-4 text-[#FF2E75]" />
          <span>Double-Blind Privacy & Slot Protection</span>
        </div>
        <p className="text-[11px] leading-relaxed text-neutral-600">
          <strong>Context Clues:</strong> Whitelisted relationship tags increase notification conversion by 3.4x without leaking identities.
        </p>
        <p className="text-[11px] leading-relaxed text-neutral-600">
          <strong>Slot Reclamation:</strong> If an invited crush never joins within 45 days, the slot is recycled back into your quota to eliminate slot paralysis.
        </p>
      </div>

      {/* 5. Add Crush Modal (With Feature 1: Context Clues & Notification Preview) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white border-2 border-black p-5 coy-shadow space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFEBF2] text-[#FF2E75] flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-[#FF2E75]" />
                </div>
                <h3 className="text-base font-black text-neutral-900">
                  Add Secret Crush
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full bg-neutral-100 text-neutral-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addedSuccess ? (
              <div className="p-8 text-center text-emerald-600 font-bold text-xs flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border-2 border-black coy-shadow-sm">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <p className="text-sm font-black text-black">
                  Encrypted Heads-Up Dispatched!
                </p>
                <p className="text-neutral-500 font-medium">
                  We sent an anonymous context hint. If they add you back, it&apos;s a mutual match!
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddCrush} className="space-y-4">
                {/* Input 1: Crush Name (Optional / Private) */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Crush&apos;s Name or Nickname
                  </label>
                  <input
                    type="text"
                    value={crushName}
                    onChange={(e) => setCrushName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Input 2: Phone or Email */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Phone Number or Email <span className="text-[#FF2E75]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or name@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Feature 1: Context Clue Selector (Whitelist) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-800">
                      Relationship Context <span className="text-[#FF2E75]">*</span>
                    </label>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      Zero-knowledge hint
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {RELATIONSHIP_OPTIONS.map((tag) => {
                      const isSelected = selectedTag === tag.id;
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            sound.playPop();
                            setSelectedTag(tag.id);
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            isSelected
                              ? 'bg-[#FFEBF2] border-black text-black font-extrabold coy-shadow-xs'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-400'
                          }`}
                        >
                          <span className="text-base">{tag.icon}</span>
                          <span className="text-xs leading-tight">{tag.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recipient Anonymous Teaser Preview Box */}
                <div className="p-3.5 rounded-2xl bg-[#F8F7FF] border border-[#DCD9FA] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#6355D8]">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Recipient Preview (What They See)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80 text-xs text-neutral-800 font-medium shadow-xs">
                    &ldquo;{activeTagPreview} If you add them back, it&apos;s a match! (app.getcoy.com)&rdquo;
                  </div>
                  <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                    <EyeOff className="w-3 h-3 text-[#FF2E75]" />
                    <span>Zero names or personal identities are ever revealed.</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 rounded-full bg-[#FF2E75] hover:bg-[#F01E65] border-2 border-black text-black text-xs font-black coy-shadow-sm active:scale-98 transition-all"
                  >
                    {submitting ? 'Registering...' : 'Add Secretly'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. Teaser Inspection Modal (Feature 1 Inspector) */}
      {showTeaserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white border-2 border-black p-5 coy-shadow space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">{showTeaserModal.tagIcon || '🎓'}</span>
                <div>
                  <h3 className="text-sm font-black text-neutral-900">
                    Anonymous Notification Teaser
                  </h3>
                  <p className="text-[10px] text-neutral-500">
                    Dispatched to {showTeaserModal.contact}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTeaserModal(null)}
                className="p-1 rounded-full bg-neutral-100 text-neutral-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Phone Message Bubble */}
            <div className="p-4 rounded-2xl bg-[#E8E6FF] border border-[#C5BFF5] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#6355D8]">
                <span>COY HEADING</span>
                <span>Just now</span>
              </div>
              <p className="text-xs text-neutral-900 font-semibold leading-relaxed">
                Someone {showTeaserModal.tagLabel ? showTeaserModal.tagLabel.toLowerCase() : 'you know'} added you as their secret crush on Coy! If you add them back, it&apos;s a mutual match.
              </p>
              <div className="inline-block px-2.5 py-1 rounded-md bg-[#6355D8] text-white text-[10px] font-bold">
                app.getcoy.com
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
              <p className="font-bold text-neutral-900">🔒 Anti-Spam Guarantee:</p>
              <p>
                The recipient sees only this standardized category hint. Your phone number, name, and profile remain completely hidden until they add you back.
              </p>
            </div>

            <button
              onClick={() => setShowTeaserModal(null)}
              className="w-full py-2.5 rounded-full bg-black text-white text-xs font-bold"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
