"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  LayoutDashboard,
  Upload,
  Database,
  MessageSquare,
  FileText,
  Settings,
  BarChart3,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Upload",
    href: "/upload",
    icon: Upload,
  },
  {
    title: "Datasets",
    href: "/datasets",
    icon: Database,
  },
  {
    title: "AI Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/[.08] bg-[#0a101a]/95 p-4 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3 px-3 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 shadow-lg shadow-cyan-950/50"><Bot className="h-5 w-5 text-slate-950" /></div>
        <div><h1 className="text-xl font-semibold tracking-tight text-white">Char(t)ex</h1><p className="text-xs text-slate-500">AI data workspace</p></div>
      </div>
      <div className="mx-2 mt-5 text-[10px] font-semibold uppercase tracking-[.18em] text-slate-600">Workspace</div>
      <nav className="mt-3 flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                active
                  ? "bg-cyan-300/12 text-cyan-100"
                  : "text-slate-400 hover:bg-white/[.055] hover:text-white"
              }`}
            >
              {active && <span className="absolute left-0 h-5 w-0.5 rounded-full bg-cyan-300" />}
              <Icon size={18} className={active ? "text-cyan-300" : "transition group-hover:text-cyan-200"} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-white/[.08] bg-white/[.035] p-4">
        <p className="text-sm font-medium text-slate-200">Need a fresh perspective?</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">Ask Char(t)ex to find the signal in your next dataset.</p>
        <Link href="/chat" className="mt-3 inline-flex text-xs font-medium text-cyan-300 transition hover:text-cyan-100">Open AI analyst →</Link>
      </div>
    </aside>
  );
}
