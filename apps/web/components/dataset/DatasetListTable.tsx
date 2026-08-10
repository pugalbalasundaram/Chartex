"use client";

import { motion } from "framer-motion";
import { Database, FileUp, Eye } from "lucide-react";

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
    return <div className="p-8 text-center text-slate-400">Loading datasets...</div>;
  }

  if (datasets.length === 0) {
    return <div className="p-8 text-center text-slate-500">No datasets uploaded yet.</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/50 shadow-xl">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.03]">
          <tr className="text-slate-400">
            <th className="p-4 text-left font-medium">Name</th>
            <th className="p-4 text-left font-medium">Type</th>
            <th className="p-4 text-left font-medium">Size</th>
            <th className="p-4 text-left font-medium">Uploaded</th>
            <th className="p-4 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {datasets.map((dataset) => (
            <motion.tr 
              key={dataset.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-white/[0.03] transition-colors"
            >
              <td className="p-4 font-medium text-slate-200">{dataset.name}</td>
              <td className="p-4 uppercase text-slate-400">{dataset.type}</td>
              <td className="p-4 text-slate-400">{(dataset.size / 1024).toFixed(1)} KB</td>
              <td className="p-4 text-slate-400">{new Date(dataset.uploaded_at).toLocaleDateString()}</td>
              <td className="p-4">
                <button 
                  onClick={() => onView(dataset)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
