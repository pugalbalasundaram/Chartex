"use client";

import React from "react";

export function StatsCard({ title, value, detail }: { title: string, value: string | number, detail?: string }) {
  return (
    <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
      <p className="text-sm font-semibold text-slate-400">{title}</p>
      <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</h3>
      {detail && <p className="mt-2 text-sm text-slate-500">{detail}</p>}
    </div>
  );
}

