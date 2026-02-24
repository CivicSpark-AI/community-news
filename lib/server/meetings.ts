import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type MeetingRecord = {
  document_id: string;
  document_link: string;
  document_pdf?: string | null;
  board_csv?: string | null;
  board_name_extracted?: string | null;
  date: string; // YYYY-MM-DD
  time?: string | null; // HH:MM (24h)
  location?: string | null;
  notes?: string | null;
};

let cachedMeetings: MeetingRecord[] | null = null;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMeetingRecord(value: unknown): value is MeetingRecord {
  if (!isPlainObject(value)) return false;
  if (typeof value.document_id !== 'string') return false;
  if (typeof value.document_link !== 'string') return false;
  if (typeof value.date !== 'string') return false;
  return true;
}

async function loadAllMeetings(): Promise<MeetingRecord[]> {
  if (process.env.NODE_ENV === 'production' && cachedMeetings) return cachedMeetings;

  const meetingsPath = path.join(
    process.cwd(),
    'docs',
    'meetings_2026',
    'meetings.json',
  );
  const raw = await readFile(meetingsPath, 'utf-8');
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('meetings.json must be an array');
  }

  const meetings = parsed.filter(isMeetingRecord);
  if (process.env.NODE_ENV === 'production') cachedMeetings = meetings;
  return meetings;
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function compareTime(a: string | null | undefined, b: string | null | undefined) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b);
}

export async function getMeetingDateCounts(): Promise<Record<string, number>> {
  const meetings = await loadAllMeetings();
  const counts: Record<string, number> = {};

  for (const meeting of meetings) {
    if (!isIsoDate(meeting.date)) continue;
    counts[meeting.date] = (counts[meeting.date] ?? 0) + 1;
  }

  return counts;
}

export async function getMeetingsForDate(
  date: string,
): Promise<MeetingRecord[]> {
  if (!isIsoDate(date)) return [];
  const meetings = await loadAllMeetings();

  return meetings
    .filter((m) => m.date === date)
    .sort((a, b) => compareTime(a.time, b.time));
}

