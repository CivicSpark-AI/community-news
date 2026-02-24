import { NextResponse } from 'next/server';

import { getMeetingsForDate } from '@/lib/server/meetings';

export const runtime = 'nodejs';

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date || !isIsoDate(date)) {
      return NextResponse.json(
        { error: 'Query param "date" must be YYYY-MM-DD' },
        { status: 400 },
      );
    }

    const meetings = await getMeetingsForDate(date);
    return NextResponse.json({
      date,
      meetings: meetings.map((m) => ({
        id: `${m.document_id}-${m.time ?? 'tbd'}-${m.board_name_extracted ?? m.board_csv ?? 'meeting'}`,
        title: m.board_name_extracted ?? m.board_csv ?? 'Meeting',
        time: m.time ?? null,
        location: m.location ?? null,
        link: m.document_link,
        notes: m.notes ?? null,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

