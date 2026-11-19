import fs from 'fs';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';
import {
  CrushRecord,
  CrushesResponse,
  DatabaseSchema,
  MatchRecord,
  Profile,
  RelationshipTag,
  SwipeAction,
  SwipeRecord,
} from './types';
import { SEED_PROFILES, PRE_LIKED_PROFILE_IDS } from '../data/seedProfiles';

export const RELATIONSHIP_TAG_METADATA: Record<
  RelationshipTag,
  { label: string; icon: string; previewText: string }
> = {
  college: {
    label: 'From college / university',
    icon: '🎓',
    previewText: 'Someone from your college / university added you as their crush on Coy!',
  },
  mutual_friends: {
    label: 'Met through mutual friends',
    icon: '👥',
    previewText: 'Someone you met through mutual friends added you as their crush on Coy!',
  },
  event: {
    label: 'Met at an event / party',
    icon: '🎉',
    previewText: 'Someone you met at an event / social gathering added you as their crush on Coy!',
  },
  work: {
    label: 'Colleague / work circle',
    icon: '💼',
    previewText: 'Someone from your work / professional circle added you as their crush on Coy!',
  },
  contacts: {
    label: 'From your contacts / circle',
    icon: '📱',
    previewText: 'Someone from your contacts added you as their crush on Coy!',
  },
};

const INITIAL_CRUSHES: CrushRecord[] = [
  {
    id: 'crush_seed_ankit',
    userId: 'current_user',
    name: 'Ankit Raj',
    contact: '+91 91289 13877',
    tag: 'college',
    tagLabel: 'From college / university',
    tagIcon: '🎓',
    status: 'waiting',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    daysActive: 18,
    cooldownDays: 45,
  },
];

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
    crushes: [...INITIAL_CRUSHES],
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
        if (!parsed.crushes || !Array.isArray(parsed.crushes) || parsed.crushes.length === 0) {
          parsed.crushes = [...INITIAL_CRUSHES];
        }
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

const MAX_CRUSH_SLOTS = 3;

/**
 * Get crushes state (crushes list, slot quotas) for user.
 */
export function getCrushesState(userId: string = 'current_user'): {
  crushes: CrushRecord[];
  maxSlots: number;
  usedSlots: number;
  availableSlots: number;
} {
  const db = ensureDb();
  if (!db.crushes || !Array.isArray(db.crushes)) {
    db.crushes = [...INITIAL_CRUSHES];
    saveDb(db);
  }

  const userCrushes = db.crushes.filter((c) => c.userId === userId);
  // Active slots are 'waiting' or 'expired'. 'reclaimed' slots are recycled back to available quota.
  const activeCount = userCrushes.filter((c) => c.status === 'waiting' || c.status === 'expired').length;

  return {
    crushes: userCrushes,
    maxSlots: MAX_CRUSH_SLOTS,
    usedSlots: activeCount,
    availableSlots: Math.max(0, MAX_CRUSH_SLOTS - activeCount),
  };
}

/**
 * Add a secret crush with a validated context/relationship tag.
 */
export function addCrush(
  userId: string = 'current_user',
  data: { name: string; contact: string; tag: RelationshipTag }
): CrushRecord {
  const db = ensureDb();
  if (!db.crushes) {
    db.crushes = [...INITIAL_CRUSHES];
  }

  const userCrushes = db.crushes.filter((c) => c.userId === userId);
  const activeCount = userCrushes.filter((c) => c.status === 'waiting' || c.status === 'expired').length;

  if (activeCount >= MAX_CRUSH_SLOTS) {
    throw new Error('All 3 crush slots are currently active. Reclaim an expired slot or wait for cooldown to expire.');
  }

  const tagMeta = RELATIONSHIP_TAG_METADATA[data.tag] || RELATIONSHIP_TAG_METADATA.contacts;

  const newCrush: CrushRecord = {
    id: `crush_${randomUUID()}`,
    userId,
    name: data.name.trim() || 'Secret Crush',
    contact: data.contact.trim(),
    tag: data.tag,
    tagLabel: tagMeta.label,
    tagIcon: tagMeta.icon,
    status: 'waiting',
    createdAt: new Date().toISOString(),
    daysActive: 0,
    cooldownDays: 45,
  };

  db.crushes.unshift(newCrush);
  saveDb(db);
  return newCrush;
}

/**
 * Demo/Test helper: Fast forward 45 days so the crush expires and can be reclaimed.
 */
export function simulateExpireCrush(
  userId: string = 'current_user',
  crushId: string
): CrushRecord {
  const db = ensureDb();
  const crush = db.crushes.find((c) => c.id === crushId && c.userId === userId);

  if (!crush) {
    throw new Error(`Crush record with id "${crushId}" not found.`);
  }

  crush.daysActive = 45;
  crush.status = 'expired';
  saveDb(db);
  return crush;
}

/**
 * Reclaim an expired crush slot, freeing up +1 available quota.
 */
export function reclaimCrushSlot(
  userId: string = 'current_user',
  crushId: string
): { success: boolean; reclaimedCrush: CrushRecord; availableSlots: number } {
  const db = ensureDb();
  const crush = db.crushes.find((c) => c.id === crushId && c.userId === userId);

  if (!crush) {
    throw new Error(`Crush record with id "${crushId}" not found.`);
  }

  if (crush.status !== 'expired') {
    throw new Error('Only expired crush slots (after 45-day cooldown) can be reclaimed.');
  }

  crush.status = 'reclaimed';
  saveDb(db);

  const activeCount = db.crushes.filter(
    (c) => c.userId === userId && (c.status === 'waiting' || c.status === 'expired')
  ).length;

  return {
    success: true,
    reclaimedCrush: crush,
    availableSlots: Math.max(0, MAX_CRUSH_SLOTS - activeCount),
  };
}
