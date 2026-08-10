"use client";

import { useRef } from "react";
import { UploadCloud } from "lucide-react";

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
}

export default function UploadBox({
  onFileSelect,
}: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;

    const allowedExtensions = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedExtensions.includes(file.type)) {
      alert("Please upload a CSV or Excel file.");
      return;
    }

    onFileSelect(file);
  };

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();

          const file = e.dataTransfer.files[0];

          handleFile(file);
        }}
        className="flex h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-500 bg-slate-900 transition hover:bg-slate-800"
      >
        <UploadCloud
          size={60}
          className="mb-4 text-cyan-400"
        />

        <h2 className="text-2xl font-semibold text-white">
          Drag & Drop your dataset
        </h2>

        <p className="mt-2 text-slate-400">
          CSV or Excel (.csv, .xlsx)
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        hidden
        onChange={(e) =>
          handleFile(e.target.files?.[0] || null)
        }
      />
    </>
  );
}