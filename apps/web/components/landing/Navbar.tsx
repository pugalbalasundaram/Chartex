"use client";

import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b border-white/10 bg-black/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        <div className="flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">
            Charex
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <a href="#">Features</a>
          <a href="#">Dashboard</a>
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
        </div>

        <Button>
          Get Started
        </Button>

      </div>
    </nav>
  );
}