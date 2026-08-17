"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DistributionItem {
  label: string;
  count: number;
}

interface DistributionChartProps {
  title: string;
  data: DistributionItem[];
}

export default function DistributionChart({
  title,
  data,
}: DistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <div className="flex h-72 items-center justify-center text-slate-500">
          No distribution data available.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">Frequency distribution of selected values.</p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
          <XAxis dataKey="label" stroke="#94a3b8" tick={{fontSize: 12}} />
          <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
          <Bar dataKey="count" fill="#22d3ee" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6">
          <p className="text-sm font-semibold text-slate-400">Bins</p>
          <p className="mt-2 text-2xl font-bold text-white">{data.length}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6">
          <p className="text-sm font-semibold text-slate-400">Total Count</p>
          <p className="mt-2 text-2xl font-bold text-white">{data.reduce((sum, item) => sum + item.count, 0)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6">
          <p className="text-sm font-semibold text-slate-400">Highest Frequency</p>
          <p className="mt-2 text-2xl font-bold text-white">{Math.max(...data.map((item) => item.count))}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6">
          <p className="text-sm font-semibold text-slate-400">Lowest Frequency</p>
          <p className="mt-2 text-2xl font-bold text-white">{Math.min(...data.map((item) => item.count))}</p>
        </div>
      </div>
    </div>
  );
}