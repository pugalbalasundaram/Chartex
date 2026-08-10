"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  labels: string[];
  values: number[];
}

interface AreaRevenueChartProps {
  chartData: ChartData | null;
}

export default function AreaRevenueChart({
  chartData,
}: AreaRevenueChartProps) {
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
          AI Generated Area Chart
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Trend generated from your dataset
        </p>
      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <AreaChart data={data}>

          <defs>
            <linearGradient
              id="areaGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#06B6D4"
                stopOpacity={0.5}
              />

              <stop
                offset="95%"
                stopColor="#06B6D4"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

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

          <Area
            type="monotone"
            dataKey="value"
            stroke="#06B6D4"
            strokeWidth={3}
            fill="url(#areaGradient)"
          />

        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}