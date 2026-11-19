export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  photos?: string[];
  bio: string;
  collegeOrCity: string;
  interests: string[];
  occupation?: string;
  distance?: string;
  pronouns?: string;
  verified?: boolean;
  promptQuestion?: string;
  promptAnswer?: string;
  lifestyle?: {
    drinking?: string;
    smoking?: string;
    zodiac?: string;
    pets?: string;
  };
}

export type SwipeAction = 'like' | 'pass';

export interface SwipeRecord {
  id: string;
  userId: string;
  profileId: string;
  action: SwipeAction;
  timestamp: string;
}

export interface MatchRecord {
  id: string;
  userId: string;
  profileId: string;
  matchedAt: string;
  profile: Profile;
  lastMessage?: string;
  unread?: boolean;
}

export type RelationshipTag =
  | 'college'
  | 'mutual_friends'
  | 'event'
  | 'work'
  | 'contacts';

export interface RelationshipTagInfo {
  id: RelationshipTag;
  label: string;
  icon: string;
  previewText: string;
}

export type CrushStatus = 'waiting' | 'expired' | 'reclaimed' | 'matched';

export interface CrushRecord {
  id: string;
  userId: string;
  name: string;
  contact: string; // phone or email (e.g. +91 91289 •••••)
  tag: RelationshipTag;
  tagLabel: string;
  tagIcon: string;
  status: CrushStatus;
  createdAt: string;
  daysActive: number; // 0 to 45
  cooldownDays: number; // 45
}

export interface DatabaseSchema {
  profiles: Profile[];
  preLikedProfileIds: string[];
  swipes: SwipeRecord[];
  matches: MatchRecord[];
  crushes: CrushRecord[];
}

export interface CrushesResponse {
  success: boolean;
  crushes: CrushRecord[];
  maxSlots: number;
  usedSlots: number;
  availableSlots: number;
  message?: string;
}

export interface SwipeResponse {
  success: boolean;
  match: boolean;
  profile?: Profile;
  message?: string;
}

export interface FeedResponse {
  success: boolean;
  profiles: Profile[];
  remainingCount: number;
}

export interface MatchesResponse {
  success: boolean;
  matches: MatchRecord[];
  totalMatches: number;
}
