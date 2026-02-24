'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Home() {
  const [value, setValue] = useState<Value>(new Date('2025-01-01T12:00:00'));

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
            <div className="text-xs opacity-90">Jan, 2025</div>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF8F4] pb-10">
        <div className="mx-auto max-w-[980px] px-10 pt-8">
          <Calendar
            className="cn-calendar"
            value={value}
            onChange={(val) => setValue(val)}
            activeStartDate={new Date('2025-01-01T12:00:00')}
            showNavigation={false}
          />
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
