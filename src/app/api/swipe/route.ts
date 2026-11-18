import { NextRequest, NextResponse } from 'next/server';
import { recordSwipe } from '@/lib/store';
import { SwipeAction, SwipeResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, action, userId = 'current_user' } = body;

    if (!profileId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing profileId or action' },
        { status: 400 }
      );
    }

    if (action !== 'like' && action !== 'pass') {
      return NextResponse.json(
        { success: false, error: "Action must be 'like' or 'pass'" },
        { status: 400 }
      );
    }

    const result = recordSwipe(userId, profileId, action as SwipeAction);

    const response: SwipeResponse = {
      success: true,
      match: result.match,
      profile: result.matchedProfile,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error recording swipe:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record swipe' },
      { status: 500 }
    );
  }
}
