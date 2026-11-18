export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  collegeOrCity: string;
  interests: string[];
  occupation?: string;
  distance?: string;
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
}

export interface DatabaseSchema {
  profiles: Profile[];
  preLikedProfileIds: string[];
  swipes: SwipeRecord[];
  matches: MatchRecord[];
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
