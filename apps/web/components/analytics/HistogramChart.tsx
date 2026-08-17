"use client";

import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

interface HistogramChartProps {
  title: string;
  data: {
    name: string;
    value: number;
  }[];
}

export default function HistogramChart({
  title,
  data,
}: HistogramChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <div className="flex h-72 items-center justify-center text-slate-500">
          No data available.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">Distribution of dataset values.</p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
          <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
          <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}