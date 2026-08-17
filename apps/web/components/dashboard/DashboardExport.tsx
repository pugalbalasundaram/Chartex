"use client";

import { Download, FileImage, FileText } from "lucide-react";
import { RefObject, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DashboardExportProps {
  targetRef: RefObject<HTMLElement | null>;
  datasetName: string;
}

export default function DashboardExport({ targetRef, datasetName }: DashboardExportProps) {
  const [exporting, setExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleExportPNG = async () => {
    if (!targetRef.current) return;
    setExporting(true);
    setIsOpen(false);
    
    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#020617", // match background
      });
      
      const link = document.createElement("a");
      link.download = `Charex_Dashboard_${datasetName.replace(/[^a-z0-9]/gi, '_')}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Export PNG failed:", error);
      alert("Failed to export dashboard as PNG.");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!targetRef.current) return;
    setExporting(true);
    setIsOpen(false);
    
    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#020617",
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      // Calculate aspect ratio
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "l" : "p",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Charex_Dashboard_${datasetName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    } catch (error) {
      console.error("Export PDF failed:", error);
      alert("Failed to export dashboard as PDF.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting}
        className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-50"
      >
        <Download size={16} />
        {exporting ? "Exporting..." : "Export"}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-white/10 bg-surface/95 p-1.5 shadow-2xl backdrop-blur-xl">
            <button
              onClick={handleExportPNG}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              <FileImage size={16} className="text-cyan-400" />
              Export as PNG
            </button>
            <button
              onClick={handleExportPDF}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              <FileText size={16} className="text-cyan-400" />
              Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
