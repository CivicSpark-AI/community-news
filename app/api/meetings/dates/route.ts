import { NextResponse } from 'next/server';

import { getMeetingDateCounts } from '@/lib/server/meetings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const counts = await getMeetingDateCounts();
    return NextResponse.json(
      { counts },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

