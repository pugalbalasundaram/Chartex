"use client";

import { motion } from "framer-motion";

export function StatsCard({ title, value, detail }: { title: string, value: string | number, detail?: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-5 shadow-xl">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">{value}</h3>
      {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
    </div>
  );
}
