"use client";

interface CorrelationHeatmapProps {
  correlation: Record<string, Record<string, number>>;
}

function getColor(value: number) {
  if (value >= 0.8) return "bg-emerald-600 text-white";
  if (value >= 0.6) return "bg-emerald-500 text-white";
  if (value >= 0.4) return "bg-emerald-400 text-slate-950";
  if (value >= 0.2) return "bg-emerald-300 text-slate-950";

  if (value <= -0.8) return "bg-rose-600 text-white";
  if (value <= -0.6) return "bg-rose-500 text-white";
  if (value <= -0.4) return "bg-rose-400 text-white";
  if (value <= -0.2) return "bg-rose-300 text-slate-950";

  return "bg-white/[0.03] text-slate-400";
}

export default function CorrelationHeatmap({
  correlation,
}: CorrelationHeatmapProps) {
  if (!correlation || Object.keys(correlation).length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
        <h2 className="text-xl font-bold text-white tracking-tight">Correlation Heatmap</h2>
        <div className="flex h-72 items-center justify-center text-slate-500">No correlation data available.</div>
      </div>
    );
  }

  const columns = Object.keys(correlation);

  return (
    <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">Correlation Heatmap</h2>
        <p className="mt-1 text-sm text-slate-400">Relationship between numerical columns.</p>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b border-white/[0.05] p-4 bg-white/[0.02]"></th>
              {columns.map((column) => (
                <th key={column} className="border-b border-white/[0.05] p-4 text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/[0.02]">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {columns.map((row) => (
              <tr key={row}>
                <th className="border-r border-white/[0.05] p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/[0.02]">
                  {row}
                </th>
                {columns.map((column) => {
                  const value = correlation[row]?.[column] ?? 0;
                  return (
                    <td
                      key={column}
                      className={`border-b border-white/[0.05] p-4 text-center text-sm font-semibold transition-colors ${getColor(value)}`}
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
    </div>
  );
}