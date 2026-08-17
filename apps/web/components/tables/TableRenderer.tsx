"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Download, Search } from "lucide-react";

interface TableRendererProps {
  tableData: Record<string, unknown>[] | null;
}

const pageSize = 8;

export default function TableRenderer({ tableData }: TableRendererProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<string | null>(null);
  const [ascending, setAscending] = useState(true);
  const [page, setPage] = useState(0);

  const safeTableData = useMemo(() => tableData ?? [], [tableData]);
  const columns = useMemo(() => safeTableData.length > 0 ? Object.keys(safeTableData[0]) : [], [safeTableData]);

  const rows = useMemo(() => {
    return safeTableData
      .filter((row) =>
        Object.values(row).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      )
      .sort((a, b) => {
        if (!sort) return 0;
        return (
          String(a[sort] ?? "").localeCompare(String(b[sort] ?? ""), undefined, {
            numeric: true,
          }) * (ascending ? 1 : -1)
        );
      });
  }, [safeTableData, query, sort, ascending]);

  if (safeTableData.length === 0) return null;

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const displayed = rows.slice(page * pageSize, (page + 1) * pageSize);

  function setSorting(column: string) {
    if (sort === column) setAscending(!ascending);
    else {
      setSort(column);
      setAscending(true);
    }
    setPage(0);
  }

  function exportCsv() {
    const csv = [
      columns.join(","),
      ...rows.map((row) =>
        columns.map((column) => JSON.stringify(row[column] ?? "")).join(",")
      ),
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "charex-analysis.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/[.08] bg-[#0a101a]/70">
      <div className="flex flex-col gap-3 border-b border-white/[.08] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Analysis table</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {rows.length} matching records
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center rounded-lg border border-white/[.08] bg-white/[.03] px-2">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
              placeholder="Search"
              className="w-28 bg-transparent px-2 py-1.5 text-xs text-slate-200 outline-none placeholder:text-slate-600"
            />
          </div>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1 rounded-lg border border-white/[.08] px-2.5 text-xs text-slate-300 transition hover:bg-white/[.06]"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-max text-left text-xs">
          <thead className="sticky top-0 z-10 bg-[#101825]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap border-b border-white/[.08] px-4 py-3 font-medium text-slate-400"
                >
                  <button
                    onClick={() => setSorting(column)}
                    className="flex items-center gap-1 hover:text-cyan-200"
                  >
                    {column}
                    <ArrowDownUp className="h-3 w-3" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((row, index) => (
              <tr
                key={index}
                className="border-b border-white/[.05] transition hover:bg-white/[.035]"
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="max-w-xs truncate px-4 py-3 text-slate-300"
                  >
                    {String(row[column] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/[.08] px-4 py-3 text-xs text-slate-500">
        <span>
          Page {page + 1} of {pages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="rounded border border-white/[.08] px-2 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= pages - 1}
            onClick={() => setPage(page + 1)}
            className="rounded border border-white/[.08] px-2 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
