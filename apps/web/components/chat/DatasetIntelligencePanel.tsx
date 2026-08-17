import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, AlertTriangle, Info, CheckCircle2, AlertCircle, Hash, Type, Calendar, ToggleLeft, ShieldAlert } from "lucide-react";
import { type DatasetProfile } from "@/lib/api";

interface DatasetIntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: { name: string };
  profile: DatasetProfile | null;
}

export default function DatasetIntelligencePanel({
  isOpen,
  onClose,
  dataset,
  profile,
}: DatasetIntelligencePanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [expandedCol, setExpandedCol] = useState<string | null>(null);

  const filteredColumns = useMemo(() => {
    if (!profile) return [];
    return profile.columns.filter((col) => {
      const matchesSearch = col.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "All" || col.semantic_type.toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [profile, searchTerm, typeFilter]);

  if (!profile) return null;

  const scorePercent = Math.min(100, Math.max(0, profile.quality_score));
  
  let readinessColor = "text-slate-400";
  let readinessBg = "bg-slate-400/10 border-slate-400/20";
  let readinessLabel = "UNKNOWN";
  
  if (profile.readiness === "READY") {
    readinessColor = "text-emerald-400";
    readinessBg = "bg-emerald-400/10 border-emerald-400/20";
    readinessLabel = "READY";
  } else if (profile.readiness === "READY_WITH_WARNINGS") {
    readinessColor = "text-amber-400";
    readinessBg = "bg-amber-400/10 border-amber-400/20";
    readinessLabel = "READY WITH WARNINGS";
  } else {
    readinessColor = "text-rose-400";
    readinessBg = "bg-rose-400/10 border-rose-400/20";
    readinessLabel = "NEEDS CLEANING";
  }

  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case "numeric": return <Hash className="h-4 w-4 text-emerald-400" />;
      case "datetime": return <Calendar className="h-4 w-4 text-purple-400" />;
      case "boolean": return <ToggleLeft className="h-4 w-4 text-blue-400" />;
      case "categorical": return <Type className="h-4 w-4 text-amber-400" />;
      case "text": return <Type className="h-4 w-4 text-cyan-400" />;
      default: return <Type className="h-4 w-4 text-slate-400" />;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "info": return <Info className="h-4 w-4 text-cyan-500" />;
      default: return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="intelligence-panel-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-white/10 bg-[#0a101a] shadow-2xl xl:max-w-xl"
            onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h2 id="intelligence-panel-title" className="text-lg font-semibold text-white">Dataset Intelligence</h2>
                <p className="text-sm text-slate-400">{dataset.name}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Overview & Data Health */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Overview</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                    <p className="text-2xl font-mono text-white">{profile.row_count.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Rows</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                    <p className="text-2xl font-mono text-white">{profile.column_count.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Columns</p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/20 p-4 space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-medium text-slate-300">Data Health Score</span>
                     <span className="text-lg font-mono font-bold text-white">{profile.quality_score} / 100</span>
                   </div>
                   
                   <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                     <div 
                       className={`h-full rounded-full ${scorePercent >= 90 ? 'bg-emerald-400' : scorePercent >= 70 ? 'bg-amber-400' : 'bg-rose-400'}`} 
                       style={{ width: `${scorePercent}%` }}
                     />
                   </div>

                   <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                     <span className={`inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold ${readinessColor} ${readinessBg}`}>
                       {readinessLabel}
                     </span>
                     <span className="inline-flex items-center rounded border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-300">
                       {profile.quality_issues.length} Issues
                     </span>
                     <span className="inline-flex items-center rounded border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-300">
                       {profile.duplicate_summary.duplicate_rows.toLocaleString()} Duplicates
                     </span>
                   </div>
                </div>
              </section>

              {/* Schema Explorer */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Schema</h3>
                  <span className="text-xs text-slate-400">{filteredColumns.length} of {profile.columns.length} columns</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 focus-within:border-cyan-500/50">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search columns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                      aria-label="Search columns"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["All", "Numeric", "Categorical", "Datetime", "Boolean", "Text"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                          typeFilter === type
                            ? "bg-cyan-500 text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-96 overflow-y-auto rounded-xl border border-white/5 bg-black/20 divide-y divide-white/5">
                    {filteredColumns.map((col) => {
                      const isExpanded = expandedCol === col.name;
                      return (
                        <div key={col.name} className="flex flex-col">
                          <button
                            onClick={() => setExpandedCol(isExpanded ? null : col.name)}
                            className="flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors text-left outline-none focus-visible:bg-white/5"
                          >
                            <div className="flex items-center gap-3">
                              {getIconForType(col.semantic_type)}
                              <div>
                                <p className="text-sm font-medium text-slate-200">
                                  {col.name}
                                  {col.likely_identifier && <span className="ml-2 inline-flex rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">ID</span>}
                                </p>
                                <p className="text-xs text-slate-500 capitalize">{col.semantic_type} · {col.dtype}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-mono text-slate-300">{col.unique_count.toLocaleString()} unique</p>
                              {col.missing_percentage > 0 ? (
                                <p className="text-[10px] text-rose-400 mt-0.5">{col.missing_percentage.toFixed(1)}% missing</p>
                              ) : (
                                <p className="text-[10px] text-emerald-400 mt-0.5">0% missing</p>
                              )}
                            </div>
                          </button>
                          
                          {isExpanded && (
                            <div className="bg-white/[0.02] p-4 text-xs text-slate-300 border-t border-white/5">
                              {col.semantic_type === "numeric" && col.numeric_stats && (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                  <div className="flex justify-between"><span>Min:</span> <span className="font-mono">{col.numeric_stats.min?.toLocaleString() ?? "N/A"}</span></div>
                                  <div className="flex justify-between"><span>Max:</span> <span className="font-mono">{col.numeric_stats.max?.toLocaleString() ?? "N/A"}</span></div>
                                  <div className="flex justify-between"><span>Mean:</span> <span className="font-mono">{col.numeric_stats.mean?.toLocaleString(undefined, {maximumFractionDigits: 2}) ?? "N/A"}</span></div>
                                  <div className="flex justify-between"><span>Median:</span> <span className="font-mono">{col.numeric_stats.median?.toLocaleString(undefined, {maximumFractionDigits: 2}) ?? "N/A"}</span></div>
                                  <div className="flex justify-between"><span>Zero Count:</span> <span className="font-mono">{col.numeric_stats.zero_count.toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span>Negative Count:</span> <span className="font-mono">{col.numeric_stats.negative_count.toLocaleString()}</span></div>
                                </div>
                              )}
                              
                              {col.semantic_type === "categorical" && col.top_values && (
                                <div className="space-y-2">
                                  <p className="text-slate-400 font-medium">Top Values</p>
                                  <div className="space-y-1">
                                    {col.top_values.map((v, i) => (
                                      <div key={i} className="flex justify-between items-center bg-black/20 px-2 py-1 rounded">
                                        <span className="truncate mr-4" title={v.value}>{v.value}</span>
                                        <span className="font-mono text-slate-400">{v.count.toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {col.semantic_type !== "numeric" && col.semantic_type !== "categorical" && (
                                <p className="text-slate-500 italic">No advanced distribution metrics for this type.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {filteredColumns.length === 0 && (
                      <div className="p-8 text-center text-sm text-slate-500">
                        No columns match your search criteria.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Quality Issues */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Quality Issues</h3>
                  {profile.quality_issues.length === 0 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
                
                {profile.quality_issues.length > 0 ? (
                  <div className="space-y-2">
                    {profile.quality_issues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-lg border border-white/5 bg-black/20 p-3">
                        <div className="mt-0.5 shrink-0">
                          {getSeverityIcon(issue.severity)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-slate-300">{issue.severity}</span>
                            {issue.column && <span className="text-[10px] font-mono text-slate-500 border border-slate-700 bg-black/40 rounded px-1">{issue.column}</span>}
                          </div>
                          <p className="mt-1 text-sm text-slate-400">{issue.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No data quality issues were found.</p>
                )}
              </section>

              {/* Outliers */}
              {profile.outliers.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Outliers</h3>
                  <div className="rounded-xl border border-white/5 bg-black/20 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white/5 text-xs text-slate-400 uppercase border-b border-white/5">
                        <tr>
                          <th className="px-4 py-3 font-medium">Column</th>
                          <th className="px-4 py-3 font-medium text-right">Count</th>
                          <th className="px-4 py-3 font-medium text-right">% of Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profile.outliers.map((o, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 text-slate-200">{o.column}</td>
                            <td className="px-4 py-3 font-mono text-slate-400 text-right">{o.outlier_count.toLocaleString()}</td>
                            <td className="px-4 py-3 font-mono text-amber-400 text-right">{o.outlier_percentage.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Correlations */}
              {profile.correlations.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Correlations</h3>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-black/20 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white/5 text-xs text-slate-400 uppercase border-b border-white/5">
                        <tr>
                          <th className="px-4 py-3 font-medium">Relationship</th>
                          <th className="px-4 py-3 font-medium text-right">Score</th>
                          <th className="px-4 py-3 font-medium text-right">Strength</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profile.correlations.map((c, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 text-slate-200">
                              <span title={c.column_a} className="max-w-[100px] inline-block truncate align-bottom">{c.column_a}</span> 
                              <span className="text-slate-500 mx-1">↔</span> 
                              <span title={c.column_b} className="max-w-[100px] inline-block truncate align-bottom">{c.column_b}</span>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-400 text-right">{c.correlation.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right capitalize text-cyan-400">{c.strength}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                    <Info className="h-3 w-3 shrink-0" /> Correlation indicates association, not causation.
                  </p>
                </section>
              )}

              {/* Recommendations */}
              {profile.recommendations.length > 0 && (
                <section className="space-y-4 pb-8">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Analysis Recommendations</h3>
                  <div className="space-y-2">
                    {profile.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-3 text-sm text-cyan-100">
                        <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0 text-cyan-400" />
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
