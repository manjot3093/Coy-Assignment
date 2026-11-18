import { NextRequest, NextResponse } from 'next/server';
import { getFeed } from '@/lib/store';
import { FeedResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'current_user';

    const profiles = getFeed(userId);

    const response: FeedResponse = {
      success: true,
      profiles,
      remainingCount: profiles.length,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}
