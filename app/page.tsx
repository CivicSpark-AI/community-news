'use client';

import { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type Meeting = {
  id: string;
  title: string;
  time: string | null;
  location: string | null;
  link: string;
  notes: string | null;
};

function atNoon(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function addMonths(date: Date, deltaMonths: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + deltaMonths, 1, 12, 0, 0);
}

function formatTime(time: string | null): string {
  if (!time) return 'TBD';
  const parsed = new Date(`1970-01-01T${time}:00`);
  if (Number.isNaN(parsed.getTime())) return time;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed);
}

export default function Home() {
  const defaultMonth = useMemo(() => new Date('2026-02-01T12:00:00'), []);
  const [viewDate, setViewDate] = useState<Date>(() => defaultMonth);
  const [selectedDay, setSelectedDay] = useState<Date>(() => defaultMonth);

  const selectedDateKey = useMemo(
    () => formatDateKey(selectedDay),
    [selectedDay],
  );

  const [dateCounts, setDateCounts] = useState<Record<string, number>>({});
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);
  const [meetingsError, setMeetingsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/meetings/dates', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load meeting dates');
        const data: unknown = await res.json();
        const counts =
          typeof data === 'object' &&
          data !== null &&
          'counts' in data &&
          typeof (data as { counts?: unknown }).counts === 'object' &&
          (data as { counts?: unknown }).counts !== null
            ? ((data as { counts: Record<string, number> }).counts ?? {})
            : {};

        if (!cancelled) setDateCounts(counts);
      } catch {
        if (!cancelled) setDateCounts({});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const today = atNoon(new Date());
    const isInDefaultMonth =
      today.getFullYear() === defaultMonth.getFullYear() &&
      today.getMonth() === defaultMonth.getMonth();
    if (isInDefaultMonth) setSelectedDay(today);
    setViewDate(defaultMonth);
  }, [defaultMonth]);

  useEffect(() => {
    const controller = new AbortController();
    setMeetingsLoading(true);
    setMeetingsError(null);

    (async () => {
      try {
        const res = await fetch(`/api/meetings/by-date?date=${selectedDateKey}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to load meetings');
        const data = (await res.json()) as { meetings?: Meeting[] };
        setMeetings(Array.isArray(data.meetings) ? data.meetings : []);
      } catch (err) {
        if ((err as { name?: string }).name === 'AbortError') return;
        setMeetings([]);
        setMeetingsError('Could not load meetings for this date.');
      } finally {
        setMeetingsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [selectedDateKey]);

  return (
    <div className="min-h-screen bg-[#FFF8F4] text-black">
      <header className="mx-auto max-w-[1200px] px-10 pt-10">
        <div className="flex items-start justify-between gap-6">
          <h1 className="font-serif text-5xl leading-none">Community News</h1>
          <a
            href="#"
            className="mt-2 inline-flex h-7 items-center rounded-full bg-[#FFB000] px-5 text-sm font-semibold text-black shadow-[0_1px_0_rgba(0,0,0,0.25)]"
          >
            RSS
          </a>
        </div>

        <div className="mt-4 h-px w-full bg-black/80" />

        <nav className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="inline-flex items-center rounded-full bg-[#FFB000] px-4 py-1 font-semibold">
            Local News:
          </span>
          <a href="https://tulsaflyer.org/" className="hover:underline">
            Tulsa Flyer
          </a>
          <a href="https://theokeagle.org/" className="hover:underline">
            The Oklahoma Eagle
          </a>
          <a
            href="https://tulsaflyer.org/category/la-semana/"
            className="hover:underline"
          >
            La Semana
          </a>
        </nav>
      </header>

      <section className="mt-10 bg-[#FFB000] py-4">
        <p className="text-center text-sm font-medium tracking-wide">
          Get updates about your community
        </p>
      </section>

      <section className="bg-[#FFF8F4] py-16">
        <div className="mx-auto flex max-w-[1200px] justify-center px-10">
          <div className="cn-offset-card relative w-full max-w-[520px] rounded-xl bg-white px-14 py-14">
            <p className="text-center text-base leading-6 text-black/80">
              Get notifications
              <br />
              for the things you
              <br />
              <span className="font-semibold text-black">care about</span>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#8E0033] text-white">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-10 py-4">
          <button
            type="button"
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center"
          >
            <span className="sr-only">Open menu</span>
            <span className="grid gap-[5px]">
              <span className="block h-[2px] w-5 bg-white" />
              <span className="block h-[2px] w-5 bg-white" />
              <span className="block h-[2px] w-5 bg-white" />
            </span>
          </button>

          <div className="leading-tight">
            <div className="text-base font-medium">
              Tulsa&apos;s <span className="font-semibold">Comprehensive</span>{' '}
              Calendar
            </div>
            <div className="text-xs opacity-90">{formatMonthLabel(viewDate)}</div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-md bg-white/10 hover:bg-white/15"
              aria-label="Previous month"
              onClick={() => setViewDate((d) => addMonths(d, -1))}
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ‹
              </span>
            </button>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-md bg-white/10 hover:bg-white/15"
              aria-label="Next month"
              onClick={() => setViewDate((d) => addMonths(d, 1))}
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ›
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF8F4] pb-10">
        <div className="mx-auto max-w-[980px] px-10 pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-0">
            <div className="mx-auto w-full max-w-[420px] lg:mx-0 lg:w-[420px] lg:shrink-0">
              <Calendar
                className="cn-calendar"
                value={selectedDay}
                onChange={(val) => {
                  if (val instanceof Date) setSelectedDay(val);
                }}
                onClickDay={(val) => setSelectedDay(val)}
                activeStartDate={viewDate}
                onActiveStartDateChange={({ activeStartDate }) => {
                  if (activeStartDate) setViewDate(activeStartDate);
                }}
                showNavigation={false}
                showNeighboringMonth={false}
                tileClassName={({ date, view }) => {
                  if (view !== 'month') return undefined;
                  const key = formatDateKey(date);
                  return dateCounts[key] ? 'cn-has-meetings' : undefined;
                }}
                tileContent={({ date, view }) => {
                  if (view !== 'month') return null;
                  const key = formatDateKey(date);
                  const count = dateCounts[key];
                  if (!count) return null;
                  return <span className="cn-meeting-dot" aria-hidden="true" />;
                }}
              />
            </div>

            <div className="flex-1">
              <div className="rounded-xl bg-white/70 px-6 py-5 ring-1 ring-black/5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-serif text-lg leading-none text-black">
                    Meetings on{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    }).format(selectedDay)}
                  </h2>
                  <div className="text-xs text-black/60">{selectedDateKey}</div>
                </div>

                <div className="mt-4">
                  {meetingsLoading ? (
                    <p className="text-sm text-black/70">Loading…</p>
                  ) : meetingsError ? (
                    <p className="text-sm text-black/70">{meetingsError}</p>
                  ) : meetings.length === 0 ? (
                    <p className="text-sm text-black/70">
                      No meetings on this date.
                    </p>
                  ) : (
                    <ul className="max-h-[420px] space-y-3 overflow-auto pr-2">
                      {meetings.map((m) => (
                        <li
                          key={m.id}
                          className="rounded-lg bg-white px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <div className="text-sm font-semibold text-black">
                              {m.title}
                            </div>
                            <div className="text-sm text-black/70">
                              {formatTime(m.time)}
                            </div>
                          </div>
                          {m.location ? (
                            <div className="mt-1 text-sm text-black/70">
                              {m.location}
                            </div>
                          ) : null}
                          <div className="mt-2">
                            <a
                              href={m.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-black underline underline-offset-2 opacity-80 hover:opacity-100"
                            >
                              View agenda
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative bg-[#FFF8F4] pb-10 pt-16">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[140px] bg-[#00DFBA]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[140px] bg-[#00DFBA]" />
        <p className="relative text-center text-[10px] text-black/60">
          Created by the CivicSpark AI team
        </p>
      </footer>
    </div>
  );
}
