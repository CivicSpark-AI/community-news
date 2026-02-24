import type { Metadata } from "next";
import { Domine, Karla } from "next/font/google";
import "./globals.css";

const geistSans = Karla({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistSerif = Domine({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community News",
  description: "Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
