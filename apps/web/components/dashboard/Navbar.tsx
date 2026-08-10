"use client";

import { Bell, ChevronDown, Command, Menu, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[.08] bg-[#070b12]/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3"><button className="rounded-lg p-2 text-slate-400 lg:hidden"><Menu className="h-5 w-5" /></button><div className="hidden items-center gap-3 rounded-xl border border-white/[.08] bg-white/[.035] px-3 py-2 sm:flex sm:w-72 lg:w-96"><Search size={16} className="text-slate-500" /><input type="text" placeholder="Search workspace..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600" /><kbd className="flex items-center gap-0.5 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500"><Command className="h-2.5 w-2.5" />K</kbd></div></div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-white/[.06] hover:text-white"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300 ring-2 ring-[#070b12]" /></button>
        <button className="flex items-center gap-2 rounded-xl border border-white/[.08] bg-white/[.035] p-1.5 pr-2 transition hover:bg-white/[.07]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300 to-blue-500 text-xs font-bold text-slate-950">P</div>
          <span className="hidden text-sm font-medium text-slate-200 sm:block">Pugal</span><ChevronDown className="hidden h-3.5 w-3.5 text-slate-500 sm:block" />
        </button>
      </div>
    </header>
  );
}
