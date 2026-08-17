"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Download, ImageDown } from "lucide-react";
import AreaRevenueChart from "./AreaRevenueChart";
import BarRevenueChart from "./BarRevenueChart";
import PieChart from "./PieChart";

interface ChartData {
  labels: string[];
  values: number[];
}
interface ChartRendererProps {
  chartType: string | null;
  chartData: ChartData | null;
}

export default function ChartRenderer({ chartType, chartData }: ChartRendererProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  if (!chartType || chartType === "none" || !chartData) return null;
  
  function exportCsv() {
    if (!chartData) return;
    const csv = [
      "label,value",
      ...chartData.labels.map(
        (label, index) => `${JSON.stringify(label)},${chartData.values[index] ?? ""}`
      ),
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "charex-chart.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }
  
  function exportPng() {
    const svg = chartRef.current?.querySelector("svg");
    if (!svg) return;
    const source = new XMLSerializer().serializeToString(svg);
    const image = new Image();
    const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml" }));
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 700;
      const context = canvas.getContext("2d");
      context?.drawImage(image, 0, 0, canvas.width, canvas.height);
      const link = document.createElement("a");
      link.download = "charex-chart.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }
  
  const type = chartType.toLowerCase();
  
  return (
    <motion.div ref={chartRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-xl border border-white/5 bg-[#0a101a]/40 p-1">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-[#101825]/50">
        <h4 className="text-sm font-semibold text-slate-200">Analysis Visualization</h4>
        <div className="flex gap-2">
          <button onClick={exportPng} title="Export PNG" className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white">
            <ImageDown className="h-3.5 w-3.5" /> PNG
          </button>
          <button onClick={exportCsv} title="Export CSV" className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </div>
      <div className="p-4 w-full overflow-x-auto">
        <div className="min-w-[500px] h-[350px]">
          {type === "bar" ? (
            <BarRevenueChart chartData={chartData} />
          ) : type === "pie" ? (
            <PieChart chartData={chartData} />
          ) : (
            <AreaRevenueChart chartData={chartData} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
