import { NextRequest, NextResponse } from 'next/server';
import { getCrushesState, reclaimCrushSlot } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { crushId } = body;

    if (!crushId) {
      return NextResponse.json(
        { success: false, message: 'crushId is required' },
        { status: 400 }
      );
    }

    const result = reclaimCrushSlot('current_user', crushId);
    const state = getCrushesState('current_user');

    return NextResponse.json({
      ...result,
      ...state,
      message: 'Crush slot safely recycled! +1 quota returned to your pool.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to reclaim crush slot' },
      { status: 400 }
    );
  }
}
