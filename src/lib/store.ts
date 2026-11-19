import fs from 'fs';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';
import { DatabaseSchema, MatchRecord, Profile, SwipeAction, SwipeRecord } from './types';
import { SEED_PROFILES, PRE_LIKED_PROFILE_IDS } from '../data/seedProfiles';

// In serverless environments (Netlify, AWS Lambda, Vercel), only /tmp is writable.
const isServerless =
  Boolean(process.env.NETLIFY) ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  Boolean(process.env.VERCEL) ||
  process.env.NODE_ENV === 'production';

const DB_DIR = isServerless ? os.tmpdir() : path.join(process.cwd(), 'src', 'data');
const DB_FILE = path.join(DB_DIR, 'coy_db.json');

// In-memory fallback ensuring zero-crash resilience
let memoryDb: DatabaseSchema | null = null;

function getFreshData(): DatabaseSchema {
  return {
    profiles: SEED_PROFILES,
    preLikedProfileIds: PRE_LIKED_PROFILE_IDS,
    swipes: [],
    matches: [],
  };
}

// Ensure database exists and is valid
function ensureDb(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as DatabaseSchema;
      if (parsed.profiles && Array.isArray(parsed.profiles)) {
        memoryDb = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read persistent DB file, using fallback:', err);
  }

  const initialData = getFreshData();
  memoryDb = initialData;

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write initial DB file, continuing in-memory:', err);
  }

  return initialData;
}

function saveDb(data: DatabaseSchema): void {
  memoryDb = data;

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    // If filesystem is restricted in serverless, memoryDb maintains state safely
    console.warn('Filesystem write failed, using in-memory store:', err);
  }
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

  return db.profiles.filter((p) => !swipedProfileIds.has(p.id));
}

/**
 * Record a swipe (like or pass).
 * Determines mutual match strictly server-side.
 */
export function recordSwipe(
  userId: string = 'current_user',
  profileId: string,
  action: SwipeAction
): { match: boolean; matchedProfile?: Profile } {
  const db = ensureDb();

  const profile = db.profiles.find((p) => p.id === profileId);
  if (!profile) {
    throw new Error(`Profile with id "${profileId}" not found.`);
  }

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

  const isMutual = action === 'like' && db.preLikedProfileIds.includes(profileId);
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
      db.matches.unshift(matchRecord);
    }
  }

  saveDb(db);

  return {
    match: isMutual,
    matchedProfile,
  };
}

/**
 * Get all mutual matches for current user.
 */
export function getMatches(userId: string = 'current_user'): MatchRecord[] {
  const db = ensureDb();
  return db.matches.filter((m) => m.userId === userId);
}

/**
 * Reset database to fresh state with all 32 seed profiles.
 */
export function resetDatabase(): void {
  const freshData = getFreshData();
  saveDb(freshData);
}
