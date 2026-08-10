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
  if (percentage >= 75) return "#dc2626";
  if (percentage >= 50) return "#ea580c";
  if (percentage >= 25) return "#ca8a04";
  return "#16a34a";
}

export default function MissingValueChart({
  data,
}: MissingValueChartProps) {
  const chartData = data.filter(
    (item) => item.missing > 0
  );

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          Missing Values
        </h2>

        <div className="flex h-72 items-center justify-center text-green-600 text-lg font-semibold">
          🎉 No missing values found.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow">

      <div className="mb-6">

        <h2 className="text-xl font-bold">
          Missing Values Analysis
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Number of missing values for each column.
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={Math.max(
          chartData.length * 55,
          350
        )}
      >

        <BarChart
          layout="vertical"
          data={chartData}
          margin={{
            left: 50,
            right: 20,
            top: 10,
            bottom: 10,
          }}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            type="number"
          />

          <YAxis
            type="category"
            dataKey="column"
            width={140}
          />

          <Tooltip
            formatter={(value) => [
              value,
              "Missing Rows",
            ]}
            labelFormatter={(label) =>
              `Column: ${label}`
            }
          />

          <Bar
            dataKey="missing"
            radius={[0, 6, 6, 0]}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.column}
                fill={getBarColor(
                  entry.percentage
                )}
              />
            ))}
          </Bar>

        </BarChart>

      </ResponsiveContainer>

      <div className="mt-8 overflow-x-auto">

        <table className="min-w-full border-collapse">

          <thead>

            <tr className="bg-gray-100">

              <th className="border p-3 text-left">
                Column
              </th>

              <th className="border p-3">
                Missing
              </th>

              <th className="border p-3">
                Percentage
              </th>

              <th className="border p-3">
                Severity
              </th>

            </tr>

          </thead>

          <tbody>

            {chartData.map((item) => {

              let severity = "Low";

              if (item.percentage >= 75)
                severity = "Critical";
              else if (
                item.percentage >= 50
              )
                severity = "High";
              else if (
                item.percentage >= 25
              )
                severity = "Medium";

              return (
                <tr
                  key={item.column}
                  className="hover:bg-gray-50"
                >

                  <td className="border p-3">
                    {item.column}
                  </td>

                  <td className="border p-3 text-center">
                    {item.missing}
                  </td>

                  <td className="border p-3 text-center">
                    {item.percentage.toFixed(2)}%
                  </td>

                  <td className="border p-3 text-center font-medium">
                    {severity}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}
