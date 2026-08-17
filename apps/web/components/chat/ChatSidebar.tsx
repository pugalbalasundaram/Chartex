import { Search } from "lucide-react";
import { useState } from "react";
import DatasetContextCard from "./DatasetContextCard";
import DatasetIntelligencePanel from "./DatasetIntelligencePanel";

import { type DatasetSummary, type DatasetPreview } from "@/app/chat/page";
import { type DatasetProfile } from "@/lib/api";

interface Dataset { id: number; name: string; type: string; size: number; uploaded_at: string; }

export default function ChatSidebar({ 
  datasets, 
  selectedDataset, 
  setSelectedDataset, 
  datasetSummary,
  datasetPreview,
  datasetProfile,
  isProfileLoading,
  profileError
}: { 
  datasets: Dataset[]; 
  selectedDataset: number | null; 
  setSelectedDataset: (id: number) => void;
  datasetSummary: DatasetSummary | null;
  datasetPreview: DatasetPreview | null;
  datasetProfile: DatasetProfile | null;
  isProfileLoading: boolean;
  profileError: string | null;
}) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const activeDataset = datasets.find(d => d.id === selectedDataset);

  return (
    <>
      <aside className="flex h-full w-full flex-col bg-surface/30 backdrop-blur-3xl xl:w-80 xl:shrink-0 xl:border-r xl:border-white/5">
        <div className="border-b border-white/5 p-5">
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Workspace</h2>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/5 bg-black/20 px-3 py-2 transition-colors focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/10">
            <Search className="h-4 w-4 text-slate-500" />
            <input aria-label="Search datasets" placeholder="Search datasets..." className="flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {datasets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <p className="text-sm text-slate-400">No datasets yet</p>
              <p className="text-xs text-slate-500 mt-1">Upload your first dataset to start analyzing with Charex.</p>
            </div>
          ) : (
            datasets.map((dataset) => {
              const isSelected = selectedDataset === dataset.id;
              return (
                <button 
                  key={dataset.id}
                  onClick={() => setSelectedDataset(dataset.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${isSelected ? "border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]" : "border-transparent bg-black/10 hover:bg-black/30 hover:border-white/5"}`}
                >
                  <p className={`text-sm font-semibold ${isSelected ? "text-cyan-400" : "text-slate-200"}`}>{dataset.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{dataset.type.toUpperCase()} · {(dataset.size / 1024).toFixed(1)} KB</p>
                </button>
              )
            })
          )}
        </div>
        
        {activeDataset && (
          <DatasetContextCard 
            dataset={{ name: activeDataset.name, type: activeDataset.type }}
            summary={datasetSummary}
            preview={datasetPreview}
            profile={datasetProfile}
            isProfileLoading={isProfileLoading}
            profileError={profileError}
            onOpenPanel={() => setIsPanelOpen(true)}
          />
        )}
      </aside>

      {/* Dataset Intelligence Overlay Panel */}
      <DatasetIntelligencePanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)}
        dataset={{ name: activeDataset?.name || "" }}
        profile={datasetProfile}
      />
    </>
  );
}
