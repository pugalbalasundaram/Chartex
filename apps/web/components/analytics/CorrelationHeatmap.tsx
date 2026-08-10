"use client";

interface CorrelationHeatmapProps {
  correlation: Record<string, Record<string, number>>;
}

function getColor(value: number) {
  const abs = Math.abs(value);

  if (value >= 0.8) return "bg-green-700 text-white";
  if (value >= 0.6) return "bg-green-600 text-white";
  if (value >= 0.4) return "bg-green-500 text-white";
  if (value >= 0.2) return "bg-green-300";

  if (value <= -0.8) return "bg-red-700 text-white";
  if (value <= -0.6) return "bg-red-600 text-white";
  if (value <= -0.4) return "bg-red-500 text-white";
  if (value <= -0.2) return "bg-red-300";

  if (abs < 0.2) return "bg-gray-100";

  return "bg-gray-200";
}

export default function CorrelationHeatmap({
  correlation,
}: CorrelationHeatmapProps) {
  if (
    !correlation ||
    Object.keys(correlation).length === 0
  ) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          Correlation Heatmap
        </h2>

        <div className="flex h-72 items-center justify-center text-gray-500">
          No correlation data available.
        </div>
      </div>
    );
  }

  const columns = Object.keys(correlation);

  return (
    <div className="rounded-xl border bg-white p-6 shadow">

      <div className="mb-6">
        <h2 className="text-xl font-bold">
          Correlation Heatmap
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Relationship between numerical columns.
        </p>
      </div>

      <div className="overflow-auto">

        <table className="min-w-full border-collapse">

          <thead>

            <tr>

              <th className="border p-3 bg-gray-50"></th>

              {columns.map((column) => (
                <th
                  key={column}
                  className="border p-3 text-xs font-semibold bg-gray-50"
                >
                  {column}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {columns.map((row) => (

              <tr key={row}>

                <th className="border bg-gray-50 p-3 text-left text-xs font-semibold">
                  {row}
                </th>

                {columns.map((column) => {

                  const value =
                    correlation[row]?.[column] ?? 0;

                  return (
                    <td
                      key={column}
                      className={`border p-3 text-center text-sm font-semibold transition-colors ${getColor(
                        value
                      )}`}
                    >
                      {value.toFixed(2)}
                    </td>
                  );
                })}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-xs">

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-700"></div>
          Strong Positive
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-400"></div>
          Positive
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-100 border"></div>
          Neutral
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-400"></div>
          Negative
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-700"></div>
          Strong Negative
        </div>

      </div>

    </div>
  );
}