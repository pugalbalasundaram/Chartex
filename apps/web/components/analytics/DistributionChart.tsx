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
      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">{title}</h2>

        <div className="flex h-72 items-center justify-center text-gray-500">
          No distribution data available.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow">

      <div className="mb-6">
        <h2 className="text-xl font-bold">{title}</h2>

        <p className="mt-1 text-sm text-gray-500">
          Frequency distribution of selected values.
        </p>
      </div>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <BarChart
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="label"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">
            Bins
          </p>

          <p className="mt-1 text-xl font-bold">
            {data.length}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">
            Total Count
          </p>

          <p className="mt-1 text-xl font-bold">
            {data.reduce(
              (sum, item) => sum + item.count,
              0
            )}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">
            Highest Frequency
          </p>

          <p className="mt-1 text-xl font-bold">
            {Math.max(
              ...data.map((item) => item.count)
            )}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">
            Lowest Frequency
          </p>

          <p className="mt-1 text-xl font-bold">
            {Math.min(
              ...data.map((item) => item.count)
            )}
          </p>
        </div>

      </div>

    </div>
  );
}