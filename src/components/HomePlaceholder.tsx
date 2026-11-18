'use client';

import React from 'react';
import { Flame, Sparkles, ShieldCheck } from 'lucide-react';

interface HomePlaceholderProps {
  onGoToDiscover: () => void;
}

export const HomePlaceholder: React.FC<HomePlaceholderProps> = ({ onGoToDiscover }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
      <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 text-pink-500 shadow-inner">
        <Sparkles className="w-8 h-8 text-pink-500/80" />
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Home (Placeholder)</h2>
      <p className="text-sm text-neutral-400 max-w-xs mb-6 leading-relaxed">
        Per the assignment specification, the primary functionality is built in the{' '}
        <span className="text-pink-400 font-medium">Discover</span> tab.
      </p>

      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-xs text-neutral-400 mb-8 max-w-xs flex items-start gap-2.5 text-left">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Coy&apos;s core promise: Double-blind matching. Your likes stay confidential unless mutual.
        </span>
      </div>

      <button
        onClick={onGoToDiscover}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all flex items-center gap-2 active:scale-95"
      >
        <Flame className="w-4 h-4 fill-white" />
        Open Discover Tab
      </button>
    </div>
  );
};
