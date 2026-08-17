"use client";

import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ChartData {
  labels: string[];
  values: number[];
}

interface PieChartProps {
  chartData: ChartData | null;
}

const COLORS = [
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#14B8A6",
  "#A855F7",
  "#84CC16",
];

export default function PieChart({
  chartData,
}: PieChartProps) {
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
          AI Generated Pie Chart
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Distribution generated from your dataset
        </p>
      </div>

      <ResponsiveContainer
        width="100%"
        height={340}
      >
        <RechartsPieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            innerRadius={60}
            labelLine={false}
            label={(props: import("recharts").PieLabelRenderProps) => {
              const cx = Number(props.cx) || 0;
              const cy = Number(props.cy) || 0;
              const midAngle = Number(props.midAngle) || 0;
              const innerRadius = Number(props.innerRadius) || 0;
              const outerRadius = Number(props.outerRadius) || 0;
              const percent = Number(props.percent) || 0;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
              const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
              if (percent < 0.05) return null;
              return (
                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold drop-shadow-md">
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={2}
            animationDuration={1500}
          >

            {data.map((_, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />
            ))}

          </Pie>

          <Tooltip
            contentStyle={{
              background: "rgba(11, 18, 30, 0.7)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "16px",
              color: "#ffffff",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)"
            }}
            itemStyle={{ color: "#ffffff" }}
          />

        </RechartsPieChart>
      </ResponsiveContainer>

    </div>
  );
}