"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", revenue: 40 },
  { month: "Feb", revenue: 55 },
  { month: "Mar", revenue: 48 },
  { month: "Apr", revenue: 72 },
  { month: "May", revenue: 66 },
  { month: "Jun", revenue: 92 },
];

export default function HeroChart() {
  return (
    <div className="mb-6 h-40 rounded-xl bg-slate-800/40 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#06b6d4"
            fill="#0891b2"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}