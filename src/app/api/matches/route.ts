import { NextRequest, NextResponse } from 'next/server';
import { getMatches } from '@/lib/store';
import { MatchesResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'current_user';

    const matches = getMatches(userId);

    const response: MatchesResponse = {
      success: true,
      matches,
      totalMatches: matches.length,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
