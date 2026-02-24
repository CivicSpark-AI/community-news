'use client'; // <-- MUST be the very first line
import { useState } from 'react';
import Calendar from 'react-calendar'
import "react-calendar/dist/Calendar.css"; // import default styles

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];


export default function Home() {
  const [value, setValue] = useState<Value>(new Date());
  return ( 
    <div className="flex min-h-screen items-center justify-center bg-[#FFF8F4] font-sans dark:bg-[#FFF8F4]">
     <main className="flex min-h-screen w-full flex-col items-center justify-between py-32 px-16 bg-[#FFF8F4] font-sans dark:bg-[#FFF8F4] sm:items-start">
       
        <h1 className="text-5xl font-bold tracking-tight text-black">
          Community News
        </h1>
        <div className="w-full h-px bg-black"></div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          // Dropdown for local news sources
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Local News
          </a>
        </div>
          <p>{" "}
            <a
              href="https://tulsaflyer.org/"
              className="font-medium text-black"
            >
              Tulsa Flyer 
            </a>{" "}
            {" "}
            <a
              href="https://theokeagle.org/"
              className="font-medium text-black"
            >
              The Oklahoma Eagle 
            </a>{" "}
            <a
              href="https://tulsaflyer.org/category/la-semana/"
              className="font-medium text-black"
            >
              La Semana 
            </a>{" "} 
            </p>
          // Dropdown for local news sources
        </div>
         <div className="w-full h-32 bg-[#FFB000] flex items-center justify-center">
        <p className="max-w-md text-lg leading-8 text-black text-right">
          Get updates about your community.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-[-20px_20px_10px_rgba(0,0,0,0.25)] max-w-md mx-auto">
        <p className="text-black text-center">Get  notifications for the things you <strong>care about</strong></p>
      </div>



  <div className="w-full h-32 bg-[#8E0033]">
        <p className="max-w-md text-lg leading-8 text-white text-right">
         Tulsa’s <strong>Comprehensive</strong> Calendar
        </p>
      </div>

       <div className="mt-30">
        <div className="w-[400px] sm:w-[500px] lg:w-[600px]">
            <Calendar
              value={value}
              onChange={(val, _event) => setValue(val)} // match signature
            />
          </div>
        </div>

        <div className="w-full h-32 bg-[#00DFBA] flex items-center justify-center">
      </div>

      </main>
    </div>
  );
}
