import { Database, Activity, AlertTriangle, ArrowRight, BarChart2 } from "lucide-react";
import { type DatasetSummary, type DatasetPreview } from "@/app/chat/page";
import { type DatasetProfile } from "@/lib/api";

interface DatasetContextCardProps {
  dataset: {
    name: string;
    type: string;
  };
  summary: DatasetSummary | null;
  preview: DatasetPreview | null;
  profile?: DatasetProfile | null;
  isProfileLoading?: boolean;
  profileError?: string | null;
  onOpenPanel?: () => void;
}

export default function DatasetContextCard({ 
  dataset, 
  summary, 
  profile, 
  isProfileLoading, 
  profileError,
  onOpenPanel 
}: DatasetContextCardProps) {
  
  if (!summary && !profile && !isProfileLoading) {
    return (
      <div className="border-t border-white/5 bg-surface/40 p-5 backdrop-blur-md">
        <h3 className="mb-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Dataset Intelligence</h3>
        <p className="text-xs text-slate-400">Dataset information unavailable</p>
      </div>
    );
  }

  // Fallback to old summary if profile fails
  const displayRows = profile ? profile.row_count : (summary ? summary.rows : 0);
  const displayCols = profile ? profile.column_count : (summary ? summary.columns : 0);
  
  let readinessColor = "text-slate-400";
  let readinessLabel = "UNKNOWN";
  
  if (profile) {
    if (profile.readiness === "READY") {
      readinessColor = "text-emerald-400";
      readinessLabel = "READY";
    } else if (profile.readiness === "READY_WITH_WARNINGS") {
      readinessColor = "text-amber-400";
      readinessLabel = "READY WITH WARNINGS";
    } else {
      readinessColor = "text-rose-400";
      readinessLabel = "NEEDS CLEANING";
    }
  }

  const qualityScore = profile ? profile.quality_score : (summary ? summary.quality_score : 0);
  const scorePercent = Math.min(100, Math.max(0, qualityScore));

  return (
    <div className="border-t border-white/5 bg-surface/40 p-5 backdrop-blur-md flex flex-col gap-4">
      <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Dataset Intelligence</h3>
      
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner">
          <Database className="h-5 w-5 text-cyan-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate" title={dataset.name}>{dataset.name}</p>
          <p className="text-xs text-slate-400 tracking-wider">
            {dataset.type.toUpperCase()} · {displayRows.toLocaleString()} × {displayCols}
          </p>
        </div>
      </div>

      {isProfileLoading ? (
        <div className="animate-pulse space-y-3 mt-1">
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
          <div className="h-6 bg-white/10 rounded w-full"></div>
          <div className="h-10 bg-white/10 rounded w-full"></div>
        </div>
      ) : profileError && !profile ? (
         <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Dataset intelligence is temporarily unavailable.</span>
            </div>
            {summary && (
               <div className="text-xs text-slate-400 mt-1">
                  Using basic preview: {summary.rows.toLocaleString()} rows, {summary.quality_score}% quality.
               </div>
            )}
         </div>
      ) : profile ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <h4 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Data Health</h4>
              <span className="text-xs font-mono font-bold text-white">{qualityScore} / 100</span>
            </div>
            
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${scorePercent >= 90 ? 'bg-emerald-400' : scorePercent >= 70 ? 'bg-amber-400' : 'bg-rose-400'}`} 
                style={{ width: `${scorePercent}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <span className={`text-[9px] font-bold tracking-wider ${readinessColor}`}>
                {readinessLabel}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/20 p-3 grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-300">
             <div className="flex items-center justify-between">
                <span>Numeric</span>
                <span className="font-mono">{profile.numeric_columns.length}</span>
             </div>
             <div className="flex items-center justify-between">
                <span>Categorical</span>
                <span className="font-mono">{profile.categorical_columns.length}</span>
             </div>
             <div className="flex items-center justify-between">
                <span>Date</span>
                <span className="font-mono">{profile.datetime_columns.length}</span>
             </div>
             <div className="flex items-center justify-between">
                <span>Text</span>
                <span className="font-mono">{profile.text_columns.length}</span>
             </div>
          </div>
          
          {profile.quality_issues.length > 0 ? (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>{profile.quality_issues.length} quality issue{profile.quality_issues.length !== 1 ? 's' : ''}</span>
            </div>
          ) : (
             <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2">
              <Activity className="h-3.5 w-3.5 shrink-0" />
              <span>No major quality issues</span>
            </div>
          )}

          <button 
            onClick={onOpenPanel}
            className="mt-1 flex w-full items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors border border-white/5 hover:border-cyan-500/30"
          >
            <span className="flex items-center gap-2"><BarChart2 className="h-3.5 w-3.5" /> View Dataset Intelligence</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
            {/* Fallback old UI when we have summary but no profile yet */}
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/5 bg-black/20 p-3">
              <div className="flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white font-mono">{summary?.rows.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Rows</span>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-white/5">
                <span className="text-lg font-bold text-white font-mono">{summary?.columns.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Columns</span>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-white/5">
                <span className="text-lg font-bold text-emerald-400 font-mono">{summary?.quality_score}%</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Quality</span>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}
