"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bot,
  LayoutDashboard,
  Database,
  MessageSquare,
  FileText,
  Settings,
  BarChart3,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Datasets", href: "/datasets", icon: Database },
  { title: "AI Chat", href: "/chat", icon: MessageSquare },
  { title: "VI — Visual Intelligence", href: "/visual-intelligence", icon: BarChart3 },
  { title: "Reports", href: "/reports", icon: FileText },
  { title: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/5 bg-surface/40 backdrop-blur-3xl shadow-[4px_0_24px_rgba(0,0,0,0.2)] lg:flex">
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-950/20">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Char(t)ex</h1>
          <p className="text-xs text-slate-400">AI Data Workspace</p>
        </div>
      </div>
      
      <div className="px-6 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Navigation</div>
      
      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link key={item.title} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 ${
                  active
                    ? "bg-white/5 text-cyan-400 shadow-sm"
                    : "text-slate-400 hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <Icon size={18} className={active ? "text-cyan-400" : "transition group-hover:text-cyan-200"} />
                <span className="font-medium">{item.title}</span>
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 h-8 w-1 rounded-r-full bg-cyan-400"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="m-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5">
        <p className="text-sm font-semibold text-white">Need a fresh perspective?</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">Ask Char(t)ex to find the signal in your next dataset.</p>
        <Link href="/chat" className="mt-4 inline-flex text-xs font-bold text-cyan-400 transition hover:text-cyan-300">Open AI analyst →</Link>
      </div>
    </aside>
  );
}
