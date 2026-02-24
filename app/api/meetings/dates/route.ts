import { NextResponse } from 'next/server';

import { getMeetingDateCounts } from '@/lib/server/meetings';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const counts = await getMeetingDateCounts();
    return NextResponse.json({ counts });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

