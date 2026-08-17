"use client";

import { ReactNode, Suspense } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import FloatingUpload from "../upload/FloatingUpload";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-[#020617] text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Noise Texture Overlay */}
      <svg className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Animated Ambient Aurora Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]" 
        />
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-40 top-1/3 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px]" 
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/3 bottom-0 h-[800px] w-[800px] rounded-full bg-emerald-500/10 blur-[150px]" 
        />
      </div>
      
      <Sidebar />
      <div className="relative z-10 flex min-h-screen flex-col pl-0 lg:pl-72">
        <Navbar />
        <main className="flex-1 p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mx-auto max-w-7xl h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Suspense fallback={null}>
        <FloatingUpload />
      </Suspense>
    </div>
  );
}
