import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { DatabaseSchema, MatchRecord, Profile, SwipeAction, SwipeRecord } from './types';
import { SEED_PROFILES, PRE_LIKED_PROFILE_IDS } from '../data/seedProfiles';

const DB_DIR = path.join(process.cwd(), 'src', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure db directory and initial database file exists
function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      profiles: SEED_PROFILES,
      preLikedProfileIds: PRE_LIKED_PROFILE_IDS,
      swipes: [],
      matches: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (!parsed.profiles || !Array.isArray(parsed.profiles)) {
      throw new Error('Invalid DB structure');
    }
    return parsed;
  } catch {
    // If corrupt, reinitialize
    const fallback: DatabaseSchema = {
      profiles: SEED_PROFILES,
      preLikedProfileIds: PRE_LIKED_PROFILE_IDS,
      swipes: [],
      matches: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function saveDb(data: DatabaseSchema): void {
  ensureDb();
  // Write to temporary file first for atomic persistence
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

/**
 * Get feed of profiles that the current user has NOT yet swiped on.
 * Strictly guarantees privacy: does NOT leak who has liked the user!
 */
export function getFeed(userId: string = 'current_user'): Profile[] {
  const db = ensureDb();
  const swipedProfileIds = new Set(
    db.swipes.filter((s) => s.userId === userId).map((s) => s.profileId)
  );

  // Return unswiped profiles
  return db.profiles.filter((p) => !swipedProfileIds.has(p.id));
}

/**
 * Record a swipe (like or pass).
 * Determines if a mutual match occurs in strict double-blind fashion:
 * only matches if action === 'like' AND the other profile is in preLikedProfileIds.
 */
export function recordSwipe(
  userId: string = 'current_user',
  profileId: string,
  action: SwipeAction
): { match: boolean; matchedProfile?: Profile } {
  const db = ensureDb();

  // Find profile
  const profile = db.profiles.find((p) => p.id === profileId);
  if (!profile) {
    throw new Error(`Profile with id "${profileId}" not found.`);
  }

  // Check if already swiped
  const existingSwipeIndex = db.swipes.findIndex(
    (s) => s.userId === userId && s.profileId === profileId
  );

  const swipeRecord: SwipeRecord = {
    id: randomUUID(),
    userId,
    profileId,
    action,
    timestamp: new Date().toISOString(),
  };

  if (existingSwipeIndex >= 0) {
    db.swipes[existingSwipeIndex] = swipeRecord;
  } else {
    db.swipes.push(swipeRecord);
  }

  // Check for mutual match
  const isMutual =
    action === 'like' && db.preLikedProfileIds.includes(profileId);

  let matchedProfile: Profile | undefined = undefined;

  if (isMutual) {
    matchedProfile = profile;
    const matchExists = db.matches.some(
      (m) => m.userId === userId && m.profileId === profileId
    );

    if (!matchExists) {
      const matchRecord: MatchRecord = {
        id: randomUUID(),
        userId,
        profileId,
        matchedAt: new Date().toISOString(),
        profile,
      };
      db.matches.unshift(matchRecord); // newest first
    }
  }

  saveDb(db);

  return {
    match: isMutual,
    matchedProfile,
  };
}

/**
 * Get all mutual matches for the current user.
 */
export function getMatches(userId: string = 'current_user'): MatchRecord[] {
  const db = ensureDb();
  return db.matches.filter((m) => m.userId === userId);
}

/**
 * Reset database to fresh state with all 32 seed profiles.
 */
export function resetDatabase(): void {
  const freshData: DatabaseSchema = {
    profiles: SEED_PROFILES,
    preLikedProfileIds: PRE_LIKED_PROFILE_IDS,
    swipes: [],
    matches: [],
  };
  saveDb(freshData);
}
