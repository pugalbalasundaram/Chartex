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
    <div className="mt-6 rounded-3xl border border-white/5 bg-surface/50 p-6 shadow-2xl shadow-black/10 backdrop-blur-3xl">

      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">
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
                stopColor="#22d3ee"
                stopOpacity={0.6}
              />

              <stop
                offset="95%"
                stopColor="#22d3ee"
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
            tickMargin={12}
          />

          <YAxis
            tick={{
              fill: "#94A3B8",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
            tickMargin={12}
          />

          <Tooltip
            contentStyle={{
              background: "rgba(11, 18, 30, 0.7)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "16px",
              color: "#ffffff",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)"
            }}
            itemStyle={{ color: "#22d3ee" }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#22d3ee"
            strokeWidth={3}
            fill="url(#areaGradient)"
            animationDuration={1500}
            animationEasing="ease-in-out"
          />

        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}