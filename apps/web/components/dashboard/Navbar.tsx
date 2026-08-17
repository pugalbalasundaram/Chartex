"use client";

import { Bell, Command, Menu, Search, ShieldAlert } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/5 bg-surface/40 px-8 backdrop-blur-3xl shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-4">
        <button className="rounded-xl p-2 text-slate-400 hover:bg-white/[0.05] lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-2.5 w-96">
          <Search size={16} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search workspace..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          />
          <kbd className="flex items-center gap-1 rounded border border-white/10 bg-white/[0.02] px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </div>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <button className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-white/[0.05] hover:text-white">
          <Bell size={18} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
        </button>
        
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-1.5 hidden md:flex">
          <ShieldAlert className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">Anonymous Session</span>
        </div>
      </div>
    </header>
  );
}
