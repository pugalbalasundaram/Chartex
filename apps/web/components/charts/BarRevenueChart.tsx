"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  labels: string[];
  values: number[];
}

interface BarRevenueChartProps {
  chartData: ChartData | null;
}

export default function BarRevenueChart({
  chartData,
}: BarRevenueChartProps) {
  if (
    !chartData ||
    chartData.labels.length === 0 ||
    chartData.values.length === 0
  ) {
    return null;
  }

  const data = chartData.labels.map(
    (label, index) => ({
      name: label,
      value: chartData.values[index],
    })
  );

  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">
          AI Generated Chart
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Generated from your dataset
        </p>
      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={data}>

          <XAxis
            dataKey="name"
            tick={{
              fill: "#94A3B8",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#94A3B8",
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#ffffff",
            }}
          />

          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            fill="#06B6D4"
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}