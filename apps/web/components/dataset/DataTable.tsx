"use client";

import { useMemo, useState } from "react";

interface DataTableProps {
  data: Record<string, unknown>[];
}

type SortDirection = "asc" | "desc";

export default function DataTable({
  data,
}: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const columns = useMemo(() => data && data.length > 0 ? Object.keys(data[0]) : [], [data]);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!search.trim()) return data;
    const keyword = search.toLowerCase();
    return data.filter((row) =>
      columns.some((column) => String(row[column] ?? "").toLowerCase().includes(keyword))
    );
  }, [search, data, columns]);

  const sortedData = useMemo(() => {
    const rows = [...filteredData];
    if (!sortColumn) return rows;
    rows.sort((a, b) => {
      const valueA = (a as Record<string, unknown>)[sortColumn];
      const valueB = (b as Record<string, unknown>)[sortColumn];
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
      return sortDirection === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
    return rows;
  }, [filteredData, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage]);

  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/[0.05] p-10 text-center text-slate-500">
        No data available.
      </div>
    );
  }

  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortColumn(column);
    setSortDirection("asc");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Dataset Records</h3>
          <p className="mt-1 text-sm text-slate-400">
            {sortedData.length} rows • {columns.length} columns
          </p>
        </div>
        <input
          type="text"
          placeholder="Search dataset..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-2xl border border-white/[0.05] bg-white/[0.02] px-5 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400 md:w-80"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-3xl border border-white/[0.05] bg-white/[0.02]">
        <table className="min-w-full text-sm">
          <thead className="bg-white/[0.02]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className="cursor-pointer border-b border-white/[0.05] px-6 py-4 text-left font-bold uppercase tracking-widest text-xs text-slate-400 hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-2">
                    <span>{column}</span>
                    {sortColumn === column && (
                      <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-white/[0.03]">
                {columns.map((column) => (
                  <td key={column} className="px-6 py-4 text-white">
                    {row[column] === null || row[column] === undefined || row[column] === ""
                      ? "-"
                      : String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-slate-400">
          Showing <span className="font-bold text-white">{sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> -{" "}
          <span className="font-bold text-white">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{" "}
          <span className="font-bold text-white">{sortedData.length}</span> records
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/[0.05] disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  currentPage === index + 1
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/[0.05] bg-white/[0.02] text-white hover:bg-white/[0.05]"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/[0.05] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}