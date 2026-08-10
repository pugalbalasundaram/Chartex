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
      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          {title}
        </h2>

        <div className="flex h-72 items-center justify-center text-gray-500">
          No data available.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow">

      <div className="mb-6">

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Distribution of dataset values.
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <BarChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="name"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}