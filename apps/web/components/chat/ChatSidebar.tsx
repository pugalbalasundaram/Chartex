"use client";

import { motion } from "framer-motion";
import { Database, Filter, Search, ArrowDownUp } from "lucide-react";

interface Dataset { id: number; name: string; type: string; size: number; uploaded_at: string; }

export default function ChatSidebar({ 
  datasets, 
  selectedDataset, 
  setSelectedDataset, 
  datasetSummary 
}: { 
  datasets: Dataset[]; 
  selectedDataset: number | null; 
  setSelectedDataset: (id: number) => void;
  datasetSummary: any;
}) {
  return (
    <aside className="hidden w-80 shrink-0 flex-col border-r border-white/[0.08] bg-slate-950/50 xl:flex">
      <div className="border-b border-white/[0.08] p-5">
        <h2 className="text-sm font-semibold text-white">Datasets</h2>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
          <Search className="h-4 w-4 text-slate-500" />
          <input aria-label="Search datasets" placeholder="Search datasets..." className="flex-1 bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-600" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {datasets.map((dataset) => {
          const isSelected = selectedDataset === dataset.id;
          return (
            <button 
              key={dataset.id}
              onClick={() => setSelectedDataset(dataset.id)}
              className={`w-full rounded-xl border p-3 text-left transition-all ${isSelected ? "border-cyan-500/30 bg-cyan-500/10" : "border-transparent bg-white/[0.02] hover:bg-white/[0.05]"}`}
            >
              <p className={`text-sm font-medium ${isSelected ? "text-cyan-100" : "text-slate-200"}`}>{dataset.name}</p>
              <p className="text-xs text-slate-500 mt-1">{dataset.type.toUpperCase()} · {(dataset.size / 1024).toFixed(1)} KB</p>
            </button>
          )
        })}
      </div>
      
      {datasetSummary && (
        <div className="border-t border-white/[0.08] p-4 bg-white/[0.02]">
          <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Context Quality</h3>
          <div className="space-y-2">
             <div className="flex justify-between text-xs">
               <span className="text-slate-500">Rows</span>
               <span className="text-slate-200 font-mono">{datasetSummary.rows}</span>
             </div>
             <div className="flex justify-between text-xs">
               <span className="text-slate-500">Quality</span>
               <span className="text-emerald-400 font-mono">{datasetSummary.quality_score}%</span>
             </div>
          </div>
        </div>
      )}
    </aside>
  );
}
