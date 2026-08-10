"use client";

import { useMemo, useState } from "react";

interface DataTableProps {
  data: Record<string, any>[];
}

type SortDirection = "asc" | "desc";

export default function DataTable({
  data,
}: DataTableProps) {
  const [search, setSearch] = useState("");

  const [sortColumn, setSortColumn] =
    useState("");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const pageSize = 10;

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
        No data available.
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return data;
    }

    const keyword = search.toLowerCase();

    return data.filter((row) =>
      columns.some((column) =>
        String(row[column] ?? "")
          .toLowerCase()
          .includes(keyword)
      )
    );
  }, [search, data]);

  const sortedData = useMemo(() => {
    const rows = [...filteredData];

    if (!sortColumn) {
      return rows;
    }

    rows.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (
        typeof valueA === "number" &&
        typeof valueB === "number"
      ) {
        return sortDirection === "asc"
          ? valueA - valueB
          : valueB - valueA;
      }

      return sortDirection === "asc"
        ? String(valueA).localeCompare(
            String(valueB)
          )
        : String(valueB).localeCompare(
            String(valueA)
          );
    });

    return rows;
  }, [
    filteredData,
    sortColumn,
    sortDirection,
  ]);

  const totalPages = Math.ceil(
    sortedData.length / pageSize
  );

  const paginatedData = useMemo(() => {
    const start =
      (currentPage - 1) * pageSize;

    return sortedData.slice(
      start,
      start + pageSize
    );
  }, [sortedData, currentPage]);

  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection((prev) =>
        prev === "asc"
          ? "desc"
          : "asc"
      );
      return;
    }

    setSortColumn(column);
    setSortDirection("asc");
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h3 className="text-lg font-semibold">
            Dataset Records
          </h3>

          <p className="text-sm text-gray-500">
            {sortedData.length} rows •{" "}
            {columns.length} columns
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
          className="w-full rounded-lg border px-4 py-2 md:w-80"
        />

      </div>

      {/* Table */}

      <div className="overflow-auto rounded-xl border">

        <table className="min-w-full">

          <thead className="sticky top-0 bg-gray-100">

            <tr>

              {columns.map((column) => (

                <th
                  key={column}
                  onClick={() =>
                    handleSort(column)
                  }
                  className="cursor-pointer border-b px-4 py-3 text-left text-sm font-semibold hover:bg-gray-200"
                >
                  <div className="flex items-center gap-2">

                    <span>{column}</span>

                    {sortColumn === column && (
                      <span>
                        {sortDirection === "asc"
                          ? "▲"
                          : "▼"}
                      </span>
                    )}

                  </div>

                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {paginatedData.map(
              (row, rowIndex) => (

                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50"
                >

                  {columns.map((column) => (

                    <td
                      key={column}
                      className="border-b px-4 py-3 text-sm"
                    >
                      {row[column] === null ||
                      row[column] === undefined ||
                      row[column] === ""
                        ? "-"
                        : String(row[column])}
                    </td>

                  ))}

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>      {/* Pagination */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="text-sm text-gray-500">

          Showing{" "}
          <span className="font-semibold">
            {sortedData.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
          </span>

          {" - "}

          <span className="font-semibold">
            {Math.min(
              currentPage * pageSize,
              sortedData.length
            )}
          </span>

          {" "}of{" "}

          <span className="font-semibold">
            {sortedData.length}
          </span>{" "}
          records

        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={() =>
              setCurrentPage((page) =>
                Math.max(page - 1, 1)
              )
            }
            disabled={currentPage === 1}
            className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => (

              <button
                key={index}
                onClick={() =>
                  setCurrentPage(index + 1)
                }
                className={`rounded-lg px-4 py-2 transition ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>

            )
          )}

          <button
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(page + 1, totalPages)
              )
            }
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}