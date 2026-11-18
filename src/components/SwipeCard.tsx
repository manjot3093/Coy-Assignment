'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, GraduationCap, Info, Heart, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Profile, SwipeAction } from '@/lib/types';

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
  const [showFullBio, setShowFullBio] = useState(false);
  const x = useMotionValue(0);

  // Dynamic card rotation proportional to drag distance
  const rotate = useTransform(x, [-250, 250], [-20, 20]);
  const opacity = useTransform(x, [-300, -250, 0, 250, 300], [0, 1, 1, 1, 0]);

  // Visual stamps (LIKE / PASS) based on drag direction
  const likeOpacity = useTransform(x, [25, 110], [0, 1]);
  const passOpacity = useTransform(x, [-25, -110], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe('pass');
    }
  };

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 0.95,
        scale: isFront ? 1 : 0.96,
        y: isFront ? 0 : 8,
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={isFront ? handleDragEnd : undefined}
      className={`absolute inset-0 w-full h-[540px] rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-800 select-none ${
        isFront ? 'cursor-grab active:cursor-grabbing z-20' : 'pointer-events-none z-10'
      }`}
      transition={{ type: 'spring', damping: 25, stiffness: 250 }}
    >
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.photo}
        alt={profile.name}
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent pointer-events-none" />

      {/* Top Header Tags */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white/90 flex items-center gap-1.5 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-pink-400" />
          <span>{profile.distance || 'Near you'}</span>
        </div>

        <div className="px-3 py-1 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-500/30 text-xs font-semibold text-pink-300 flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified</span>
        </div>
      </div>

      {/* LIKE Stamp overlay (Appears when dragging Right) */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-14 left-6 z-30 pointer-events-none -rotate-12 border-4 border-emerald-400 bg-emerald-500/20 backdrop-blur-sm px-4 py-1.5 rounded-2xl shadow-xl"
      >
        <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold text-2xl tracking-wider">
          <Heart className="w-6 h-6 fill-emerald-300" />
          LIKE
        </div>
      </motion.div>

      {/* PASS / NOPE Stamp overlay (Appears when dragging Left) */}
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-14 right-6 z-30 pointer-events-none rotate-12 border-4 border-rose-500 bg-rose-500/20 backdrop-blur-sm px-4 py-1.5 rounded-2xl shadow-xl"
      >
        <div className="flex items-center gap-1.5 text-rose-400 font-extrabold text-2xl tracking-wider">
          <X className="w-7 h-7 stroke-[3]" />
          PASS
        </div>
      </motion.div>

      {/* Profile Details at Bottom of Card */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white flex flex-col justify-end">
        {/* Name and Age */}
        <div className="flex items-baseline justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-white">{profile.name}</h3>
            <span className="text-2xl font-normal text-neutral-300">{profile.age}</span>
            <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-400/20" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullBio(!showFullBio);
            }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors pointer-events-auto"
            aria-label="Toggle profile information"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* College / City & Occupation */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-300 mb-2.5">
          <GraduationCap className="w-4 h-4 text-pink-400 shrink-0" />
          <span className="truncate">{profile.collegeOrCity}</span>
          {profile.occupation && (
            <>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-300 truncate">{profile.occupation}</span>
            </>
          )}
        </div>

        {/* Bio */}
        <p className={`text-xs text-neutral-200 leading-relaxed mb-3 ${showFullBio ? '' : 'line-clamp-2'}`}>
          {profile.bio}
        </p>

        {/* Interests Pills */}
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((interest, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-full bg-neutral-800/80 backdrop-blur-md border border-white/10 text-[11px] font-medium text-neutral-200"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
