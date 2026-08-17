"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

interface MissingValue {
  column: string;
  missing: number;
  percentage: number;
}

interface MissingValueChartProps {
  data: MissingValue[];
}

function getBarColor(percentage: number) {
  if (percentage >= 75) return "#f43f5e"; // rose-500
  if (percentage >= 50) return "#f97316"; // orange-500
  if (percentage >= 25) return "#eab308"; // yellow-500
  return "#10b981"; // emerald-500
}

export default function MissingValueChart({
  data,
}: MissingValueChartProps) {
  const chartData = data.filter((item) => item.missing > 0);

  if (chartData.length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
        <h2 className="text-xl font-bold text-white tracking-tight">Missing Values</h2>
        <div className="flex h-72 items-center justify-center text-emerald-400 text-lg font-bold">
          🎉 No missing values found.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">Missing Values Analysis</h2>
        <p className="mt-1 text-sm text-slate-400">Number of missing values for each column.</p>
      </div>

      <ResponsiveContainer width="100%" height={Math.max(chartData.length * 60, 350)}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
          <XAxis type="number" stroke="#94a3b8" tick={{fontSize: 12}} />
          <YAxis type="category" dataKey="column" width={140} stroke="#94a3b8" tick={{fontSize: 12}} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
          <Bar dataKey="missing" radius={[0, 8, 8, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.column} fill={getBarColor(entry.percentage)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-10 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="border-b border-white/[0.05] p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400">Column</th>
              <th className="border-b border-white/[0.05] p-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Missing</th>
              <th className="border-b border-white/[0.05] p-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Percentage</th>
              <th className="border-b border-white/[0.05] p-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {chartData.map((item) => {
              let severity = "Low";
              let color = "text-emerald-400";
              if (item.percentage >= 75) { severity = "Critical"; color = "text-rose-400"; }
              else if (item.percentage >= 50) { severity = "High"; color = "text-orange-400"; }
              else if (item.percentage >= 25) { severity = "Medium"; color = "text-amber-400"; }

              return (
                <tr key={item.column} className="hover:bg-white/[0.03]">
                  <td className="p-4 text-sm font-semibold text-white">{item.column}</td>
                  <td className="p-4 text-sm text-slate-300 text-center">{item.missing}</td>
                  <td className="p-4 text-sm text-slate-300 text-center">{item.percentage.toFixed(2)}%</td>
                  <td className={`p-4 text-sm font-bold text-center ${color}`}>{severity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

