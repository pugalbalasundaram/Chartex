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
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">
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
            label
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
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#ffffff",
            }}
          />

        </RechartsPieChart>
      </ResponsiveContainer>

    </div>
  );
}