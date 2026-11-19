import { NextRequest, NextResponse } from 'next/server';
import { addCrush, getCrushesState } from '@/lib/store';
import { RelationshipTag } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const state = getCrushesState('current_user');
    return NextResponse.json({
      success: true,
      ...state,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch crushes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contact, tag } = body;

    if (!contact || typeof contact !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Valid phone number or email is required' },
        { status: 400 }
      );
    }

    const validTags: RelationshipTag[] = [
      'college',
      'mutual_friends',
      'event',
      'work',
      'contacts',
    ];

    const selectedTag: RelationshipTag = validTags.includes(tag) ? tag : 'contacts';

    const newCrush = addCrush('current_user', {
      name: name || 'Secret Crush',
      contact,
      tag: selectedTag,
    });

    const state = getCrushesState('current_user');

    return NextResponse.json({
      success: true,
      crush: newCrush,
      ...state,
      message: 'Secret crush registered with privacy-safe zero-knowledge context tag!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add crush' },
      { status: 400 }
    );
  }
}
