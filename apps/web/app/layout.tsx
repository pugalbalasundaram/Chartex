"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/branding/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {!isSplashComplete && (
          <SplashScreen onComplete={() => setIsSplashComplete(true)} />
        )}
        <div style={{ opacity: isSplashComplete ? 1 : 0, transition: "opacity 0.5s" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
