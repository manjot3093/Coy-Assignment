'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, GraduationCap, Info, Heart, X, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Wine, Moon, Sparkle } from 'lucide-react';
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
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const photos = profile.photos && profile.photos.length > 0
    ? profile.photos
    : [profile.photo];

  const x = useMotionValue(0);

  // Dynamic card physics
  const rotate = useTransform(x, [-260, 260], [-18, 18]);
  const opacity = useTransform(x, [-320, -260, 0, 260, 320], [0, 1, 1, 1, 0]);

  // Tactile stamp indicators
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 95;
    const velocityThreshold = 350;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      sound.playSwipe('like');
      onSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      sound.playSwipe('pass');
      onSwipe('pass');
    }
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();
    setCurrentPhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();
    setCurrentPhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 0.94,
        scale: isFront ? 1 : 0.95,
        y: isFront ? 0 : 10,
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={isFront ? handleDragEnd : undefined}
      className={`absolute inset-0 w-full h-[550px] rounded-[32px] overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-800/80 select-none ${
        isFront ? 'cursor-grab active:cursor-grabbing z-20' : 'pointer-events-none z-10'
      }`}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
    >
      {/* Photo Loader Skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-pink-500/40 border-t-pink-500 animate-spin" />
        </div>
      )}

      {/* Main Photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[currentPhotoIdx]}
        alt={profile.name}
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        draggable={false}
      />

      {/* Modern Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 via-55% to-transparent pointer-events-none" />

      {/* Story-Style Multi-Photo Segment Dashes (if profile has >1 photo) */}
      {photos.length > 1 && (
        <div className="absolute top-2.5 left-4 right-4 flex items-center gap-1.5 z-30 pointer-events-none">
          {photos.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                idx === currentPhotoIdx
                  ? 'bg-white shadow'
                  : 'bg-white/30 backdrop-blur-sm'
              }`}
            />
          ))}
        </div>
      )}

      {/* Photo Tap Zones (Left 40% prev, Right 40% next) */}
      {isFront && photos.length > 1 && (
        <div className="absolute top-8 left-0 right-0 h-[60%] flex z-10">
          <div
            onClick={handlePrevPhoto}
            className="w-1/2 h-full cursor-pointer"
            aria-label="Previous photo"
          />
          <div
            onClick={handleNextPhoto}
            className="w-1/2 h-full cursor-pointer"
            aria-label="Next photo"
          />
        </div>
      )}

      {/* Top Header Floating Tags */}
      <div className="absolute top-6 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white flex items-center gap-1.5 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-pink-400" />
          <span>{profile.distance || 'Near you'}</span>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-500/30 text-[11px] font-semibold text-pink-300 flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3" />
          <span>Double-Blind Active</span>
        </div>
      </div>

      {/* Stamp: LIKE */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-16 left-6 z-40 pointer-events-none -rotate-12 border-4 border-emerald-400 bg-emerald-500/30 backdrop-blur-md px-5 py-1.5 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-2 text-emerald-300 font-black text-3xl tracking-widest">
          <Heart className="w-7 h-7 fill-emerald-300" />
          LIKE
        </div>
      </motion.div>

      {/* Stamp: PASS */}
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-16 right-6 z-40 pointer-events-none rotate-12 border-4 border-rose-500 bg-rose-500/30 backdrop-blur-md px-5 py-1.5 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-2 text-rose-300 font-black text-3xl tracking-widest">
          <X className="w-8 h-8 stroke-[3.5]" />
          PASS
        </div>
      </motion.div>

      {/* Bottom Profile Details Container */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-30 text-white flex flex-col justify-end">
        {/* Name, Age, Pronouns */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-white">{profile.name}</h3>
            <span className="text-2xl font-normal text-neutral-300">{profile.age}</span>
            {profile.pronouns && (
              <span className="text-xs text-neutral-400 font-normal">({profile.pronouns})</span>
            )}
            <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-400/20 shrink-0" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sound.playPop();
              setShowFullDetails(!showFullDetails);
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors pointer-events-auto backdrop-blur-sm"
            aria-label="Toggle profile details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* College & Profession */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-300 mb-2.5">
          <GraduationCap className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span className="truncate">{profile.collegeOrCity}</span>
          {profile.occupation && (
            <>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-300 truncate">{profile.occupation}</span>
            </>
          )}
        </div>

        {/* Bio */}
        <p className={`text-xs text-neutral-200 leading-relaxed mb-3 ${showFullDetails ? '' : 'line-clamp-2'}`}>
          {profile.bio}
        </p>

        {/* Hinge-style Prompt Callout (if active) */}
        {profile.promptQuestion && showFullDetails && (
          <div className="mb-3 p-3 rounded-2xl bg-neutral-900/80 border border-neutral-700/60 backdrop-blur-md animate-fadeIn">
            <p className="text-[10px] uppercase font-bold text-pink-400 tracking-wider mb-0.5">
              {profile.promptQuestion}
            </p>
            <p className="text-xs text-neutral-100 italic">
              &ldquo;{profile.promptAnswer}&rdquo;
            </p>
          </div>
        )}

        {/* Lifestyle badges (if present) */}
        {profile.lifestyle && showFullDetails && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {profile.lifestyle.zodiac && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] text-neutral-300 flex items-center gap-1">
                <Sparkle className="w-2.5 h-2.5 text-amber-300" />
                {profile.lifestyle.zodiac}
              </span>
            )}
            {profile.lifestyle.drinking && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] text-neutral-300 flex items-center gap-1">
                <Wine className="w-2.5 h-2.5 text-pink-400" />
                {profile.lifestyle.drinking}
              </span>
            )}
            {profile.lifestyle.pets && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] text-neutral-300">
                🐾 {profile.lifestyle.pets}
              </span>
            )}
          </div>
        )}

        {/* Interests Pills */}
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((interest, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 text-[11px] font-medium text-neutral-200"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
