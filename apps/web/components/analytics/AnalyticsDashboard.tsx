"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import InsightsPanel from "@/components/analytics/InsightsPanel";
import { ChevronDown, Loader2, Sparkles, HelpCircle } from "lucide-react";
import { Dataset } from "@/types";

interface AnalyticsData {
  summary: {
    rows: number;
    columns: number;
    quality_score: number;
    memory_usage_mb: number;
  };
  duplicate_rows: number;
  total_missing_cells: number;
  ai_insights?: string;
  suggested_questions?: string[];
  recommended_charts?: Array<{
    type: string;
    reason: string;
  }>;
}

export default function AnalyticsDashboard() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const res = await api.get("/datasets/");
        setDatasets(res.data);
        if (res.data.length > 0) {
          setSelectedDatasetId(res.data[0].id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch datasets", error);
        setLoading(false);
      }
    }
    fetchDatasets();
  }, []);

  useEffect(() => {
    async function fetchAnalytics(datasetId: number) {
      setLoading(true);
      setAnalytics(null);
      let isPolling = true;

      try {
        while (isPolling && datasetId === selectedDatasetId) {
          const res = await api.get(`/datasets/${datasetId}/analytics`);
          
          if (res.status === 202) {
            setPolling(true);
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Poll every 3s
          } else if (res.status === 200) {
            setAnalytics(res.data);
            setPolling(false);
            isPolling = false;
          } else {
            isPolling = false;
            setPolling(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
        setPolling(false);
      } finally {
        setLoading(false);
      }
    }

    if (selectedDatasetId) {
      fetchAnalytics(selectedDatasetId);
    }
  }, [selectedDatasetId]);

  if (datasets.length === 0 && !loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center rounded-3xl border border-white/[0.05] bg-white/[0.02]">
        <div className="rounded-full bg-white/[0.05] p-6">
          <Sparkles className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="mt-6 text-xl font-bold text-white">No Datasets Available</h3>
        <p className="mt-2 text-slate-400">Upload a dataset to see AI-powered analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dataset Selector */}
      <div className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-slate-400">Select Dataset:</label>
          <div className="relative">
            <select
              value={selectedDatasetId || ""}
              onChange={(e) => setSelectedDatasetId(Number(e.target.value))}
              className="appearance-none rounded-xl border border-white/[0.1] bg-white/[0.05] py-2 pl-4 pr-10 text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            >
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.id} className="bg-slate-900">
                  {ds.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {(loading || polling) && !analytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-[50vh] flex-col items-center justify-center rounded-3xl border border-white/[0.05] bg-white/[0.02]"
          >
            <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
            <h3 className="mt-6 text-xl font-bold text-white">
              {polling ? "Generating AI Insights..." : "Loading Analytics..."}
            </h3>
            <p className="mt-2 text-slate-400">
              {polling ? "Our AI is currently analyzing your dataset structure and identifying key trends." : "Fetching your dashboard..."}
            </p>
          </motion.div>
        )}

        {analytics && !loading && !polling && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Top Level Summary Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 backdrop-blur-xl">
                <p className="text-sm font-medium text-slate-400">Total Rows</p>
                <p className="mt-2 text-3xl font-bold text-white">{analytics.summary.rows?.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 backdrop-blur-xl">
                <p className="text-sm font-medium text-slate-400">Total Columns</p>
                <p className="mt-2 text-3xl font-bold text-white">{analytics.summary.columns?.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 backdrop-blur-xl">
                <p className="text-sm font-medium text-slate-400">Data Quality Score</p>
                <p className="mt-2 text-3xl font-bold text-cyan-400">{analytics.summary.quality_score}%</p>
              </div>
              <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 backdrop-blur-xl">
                <p className="text-sm font-medium text-slate-400">Duplicate Rows</p>
                <p className="mt-2 text-3xl font-bold text-white">{analytics.duplicate_rows?.toLocaleString()}</p>
              </div>
            </div>

            {/* AI Insights and Suggestions */}
            {(analytics.ai_insights || (analytics.suggested_questions && analytics.suggested_questions.length > 0)) && (
              <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/[0.05] to-transparent p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-cyan-500/20 p-2 text-cyan-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Charex AI Insights</h2>
                </div>
                
                {analytics.ai_insights && (
                  <div className="prose prose-invert mt-6 max-w-none text-slate-300">
                    <p className="leading-relaxed">{analytics.ai_insights}</p>
                  </div>
                )}

                {analytics.suggested_questions && analytics.suggested_questions.length > 0 && (
                  <div className="mt-8">
                    <p className="mb-4 text-sm font-medium text-slate-400">Suggested questions to explore:</p>
                    <div className="flex flex-wrap gap-3">
                      {analytics.suggested_questions.map((question: string, i: number) => (
                        <div key={i} className="flex cursor-pointer items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-2 hover:bg-white/[0.1] transition-colors">
                          <HelpCircle className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm text-white">{question}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Existing Analytics Dashboard Components */}
            <InsightsPanel
              summary={{
                rows: analytics.summary.rows,
                columns: analytics.summary.columns,
                quality_score: analytics.summary.quality_score,
                memory_usage: `${analytics.summary.memory_usage_mb} MB`,
              }}
              missing={{ total_missing: analytics.total_missing_cells }}
              duplicates={{ duplicate_rows: analytics.duplicate_rows }}
            />

            {/* Example Chart Rendering (Dynamic) */}
            {analytics.recommended_charts && analytics.recommended_charts.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-6 text-xl font-bold text-white">Recommended Visualizations</h3>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {analytics.recommended_charts.map((chart: Record<string, string>, i: number) => (
                    <div key={i} className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 backdrop-blur-xl">
                      <h4 className="text-lg font-bold text-white capitalize">{chart.type} Chart</h4>
                      <p className="mt-2 text-sm text-slate-400">{chart.reason}</p>
                      <div className="mt-6 flex h-48 items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <p className="text-sm text-slate-500">Visualization placeholder</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
