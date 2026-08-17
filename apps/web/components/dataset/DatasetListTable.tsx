"use client";

import { motion } from "framer-motion";
import { Database, Eye } from "lucide-react";

interface Dataset {
  id: number;
  name: string;
  type: string;
  size: number;
  uploaded_at: string;
}

export default function DatasetListTable({ 
  datasets, 
  loading, 
  onView 
}: { 
  datasets: Dataset[]; 
  loading: boolean; 
  onView: (dataset: Dataset) => void 
}) {
  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading datasets...</div>;
  }

  if (datasets.length === 0) {
    return <div className="p-10 text-center text-slate-500 rounded-3xl border border-dashed border-white/[0.05]">No datasets uploaded yet.</div>;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-surface/50 backdrop-blur-xl shadow-xl shadow-black/10">
      <table className="w-full text-sm">
        <thead className="border-b border-white/5 bg-black/20">
          <tr className="text-slate-400">
            <th className="p-6 text-left font-bold uppercase tracking-widest text-xs">Name</th>
            <th className="p-6 text-left font-bold uppercase tracking-widest text-xs">Type</th>
            <th className="p-6 text-left font-bold uppercase tracking-widest text-xs">Size</th>
            <th className="p-6 text-left font-bold uppercase tracking-widest text-xs">Uploaded</th>
            <th className="p-6 text-right font-bold uppercase tracking-widest text-xs">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {datasets.map((dataset) => (
            <motion.tr 
              key={dataset.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              className="transition-colors"
            >
              <td className="p-6 font-semibold text-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Database className="h-4 w-4" />
                  </div>
                  {dataset.name}
                </div>
              </td>
              <td className="p-6 uppercase text-slate-400">{dataset.type}</td>
              <td className="p-6 text-slate-400">{(dataset.size / 1024).toFixed(1)} KB</td>
              <td className="p-6 text-slate-400">{new Date(dataset.uploaded_at).toLocaleDateString()}</td>
              <td className="p-6 text-right">
                <button 
                  onClick={() => onView(dataset)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                >
                  <Eye className="h-4 w-4" /> View
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
