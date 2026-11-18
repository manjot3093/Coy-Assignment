'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, GraduationCap, Info, Heart, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Profile, SwipeAction } from '@/lib/types';
import { sound } from '@/lib/sound';

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (action: SwipeAction) => void;
  isFront: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipe,
  isFront,
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const x = useMotionValue(0);

  // Dynamic card rotation proportional to drag
  const rotate = useTransform(x, [-260, 260], [-18, 18]);
  const opacity = useTransform(x, [-350, -260, 0, 260, 350], [0, 1, 1, 1, 0]);

  // Stamp overlays
  const likeOpacity = useTransform(x, [25, 95], [0, 1]);
  const passOpacity = useTransform(x, [-25, -95], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 90;
    const velocityThreshold = 300;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      sound.playSwipe('like');
      onSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      sound.playSwipe('pass');
      onSwipe('pass');
    }
  };

  return (
    <motion.div
      key={profile.id}
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 0.95,
        scale: isFront ? 1 : 0.96,
        y: isFront ? 0 : 8,
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={isFront ? handleDragEnd : undefined}
      initial={{ scale: 0.96, opacity: 0.8 }}
      animate={{ scale: isFront ? 1 : 0.96, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      className={`absolute inset-0 w-full h-[530px] rounded-[30px] border-2 border-black coy-shadow overflow-hidden bg-neutral-900 select-none ${
        isFront ? 'cursor-grab active:cursor-grabbing z-20' : 'pointer-events-none z-10'
      }`}
      transition={{ type: 'spring', damping: 26, stiffness: 260 }}
    >
      {/* Profile Photo - Dedicated to this profile */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.photo}
        alt={profile.name}
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Dark gradient overlay for crystal clear text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 via-50% to-transparent pointer-events-none" />

      {/* Top Floating Tags */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white flex items-center gap-1.5 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-[#FF2E75]" />
          <span>{profile.distance || 'Near you'}</span>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-[#FF2E75] text-[11px] font-extrabold text-white border border-black flex items-center gap-1 shadow-xs">
          <Sparkles className="w-3 h-3" />
          <span>Coy Verified</span>
        </div>
      </div>

      {/* Stamp: LIKE (Shows on drag right) */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-16 left-6 z-40 pointer-events-none -rotate-12 border-3 border-black bg-[#10B981] text-white px-5 py-1.5 rounded-2xl coy-shadow-sm"
      >
        <div className="flex items-center gap-2 font-black text-2xl tracking-widest">
          <Heart className="w-6 h-6 fill-white" />
          LIKE
        </div>
      </motion.div>

      {/* Stamp: PASS (Shows on drag left) */}
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-16 right-6 z-40 pointer-events-none rotate-12 border-3 border-black bg-[#EF4444] text-white px-5 py-1.5 rounded-2xl coy-shadow-sm"
      >
        <div className="flex items-center gap-2 font-black text-2xl tracking-widest">
          <X className="w-7 h-7 stroke-[3.5]" />
          PASS
        </div>
      </motion.div>

      {/* Profile Details Container (Strictly bound to current profile) */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-30 text-white flex flex-col justify-end pointer-events-none">
        {/* Name and Age */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black tracking-tight text-white">{profile.name}</h3>
            <span className="text-2xl font-normal text-neutral-200">{profile.age}</span>
            <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-400/20 shrink-0" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sound.playPop();
              setShowFullDetails(!showFullDetails);
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors pointer-events-auto backdrop-blur-sm"
            aria-label="Toggle profile details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* College & Profession */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-200 font-medium mb-2.5">
          <GraduationCap className="w-3.5 h-3.5 text-[#FF2E75] shrink-0" />
          <span className="truncate">{profile.collegeOrCity}</span>
          {profile.occupation && (
            <>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-200 truncate">{profile.occupation}</span>
            </>
          )}
        </div>

        {/* Bio */}
        <p className={`text-xs text-neutral-100 leading-relaxed mb-3 ${showFullDetails ? '' : 'line-clamp-2'}`}>
          {profile.bio}
        </p>

        {/* Interests Pills */}
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((interest, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
