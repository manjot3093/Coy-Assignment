import { NextRequest, NextResponse } from 'next/server';
import { getCrushesState, simulateExpireCrush } from '@/lib/store';

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

    const updatedCrush = simulateExpireCrush('current_user', crushId);
    const state = getCrushesState('current_user');

    return NextResponse.json({
      success: true,
      crush: updatedCrush,
      ...state,
      message: 'Simulated 45 days cooldown expiry! Slot is now ready for reclamation.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to simulate expiry' },
      { status: 400 }
    );
  }
}
