"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardExport from "@/components/dashboard/DashboardExport";
import { getDatasets, getDatasetProfile, getDatasetData, getDatasetAnalytics } from "@/lib/api";
import type { DatasetProfile } from "@/lib/api";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell
} from "recharts";
import { Info, AlertCircle, BarChart3, Database } from "lucide-react";

export default function VisualIntelligencePage() {
  const [datasets, setDatasets] = useState<{ id: number; name: string }[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null);
  
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  
  const [loading, setLoading] = useState(true);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      try {
        const ds = await getDatasets();
        setDatasets(ds);
        if (ds && ds.length > 0) {
          setSelectedDatasetId(ds[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (selectedDatasetId === null) return;
    
    async function loadData() {
      setLoading(true);
      try {
        const [prof, d, an] = await Promise.all([
          getDatasetProfile(selectedDatasetId!),
          getDatasetData(selectedDatasetId!),
          getDatasetAnalytics(selectedDatasetId!)
        ]);
        setProfile(prof);
        setData(d.data || []);
        if (an.status === "COMPLETED") {
          setAnalytics(an.data);
        }
      } catch (err) {
        console.error("Failed to load dataset insights", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedDatasetId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="h-8 w-8 animate-spin text-cyan-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-slate-400 font-medium">Generating Visual Intelligence...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // EMPTY STATE
  if (!selectedDatasetId || !profile) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex max-w-lg flex-col items-center text-center p-8 rounded-3xl border border-white/5 bg-surface/50 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 mb-6 border border-white/5 shadow-inner">
              <BarChart3 className="h-10 w-10 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Visual Intelligence</h1>
            <p className="mt-4 text-slate-400 leading-relaxed text-sm">
              Turn your data into an intelligent, dynamic dashboard instantly. Upload a dataset to automatically generate insights, KPIs, and interactive visualizations.
            </p>
            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-slate-500">
              Use the Global Upload Button above
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  const selectedDatasetInfo = datasets.find((d) => d.id === selectedDatasetId);
  const COLORS = ['#22d3ee', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  // Identify column roles
  const numCols = profile.columns.filter(c => c.semantic_type === "numeric" || c.semantic_type === "currency" || c.semantic_type === "percentage");
  const catCols = profile.columns.filter(c => c.semantic_type === "categorical" || c.semantic_type === "boolean");
  const dateCols = profile.columns.filter(c => c.semantic_type === "datetime");

  // Dashboard Generation Logic
  const renderCharts = () => {
    const charts = [];
    
    // 1. Time Series Line Chart (if datetime + numeric exists)
    if (dateCols.length > 0 && numCols.length > 0) {
      const dateCol = dateCols[0].name;
      const numCol = numCols[0].name;
      
      // Sort data by date
      const sortedData = [...data].sort((a, b) => new Date(a[dateCol] as string | number).getTime() - new Date(b[dateCol] as string | number).getTime());
      
      charts.push(
        <div key="timeseries" className="col-span-full rounded-3xl border border-white/5 bg-surface/40 p-6 backdrop-blur-xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            {numCol} over {dateCol}
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey={dateCol} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString()} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line type="monotone" dataKey={numCol} stroke="#22d3ee" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "#22d3ee", stroke: "#0f172a", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
    
    // 2. Categorical vs Numeric Bar Chart
    if (catCols.length > 0 && numCols.length > 0) {
      const catCol = catCols[0].name;
      const numCol = numCols.length > 1 && dateCols.length > 0 ? numCols[1].name : numCols[0].name; // Try to use a different metric if possible
      
      // Group by category and sum
      const grouped: Record<string, number> = {};
      data.forEach(row => {
        const key = String(row[catCol] || 'Unknown');
        grouped[key] = (grouped[key] || 0) + (Number(row[numCol]) || 0);
      });
      
      // Sort and take top 10
      const barData = Object.entries(grouped)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
        
      charts.push(
        <div key="bar" className="col-span-1 rounded-3xl border border-white/5 bg-surface/40 p-6 backdrop-blur-xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Top {catCol} by {numCol}
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
    
    // 3. Scatter or Distribution
    if (numCols.length >= 2 && charts.length < 3) {
      const xCol = numCols[0].name;
      const yCol = numCols[1].name;
      
      const scatterData = data.filter(d => d[xCol] != null && d[yCol] != null).slice(0, 500); // Limit to 500 pts
      
      charts.push(
        <div key="scatter" className="col-span-1 rounded-3xl border border-white/5 bg-surface/40 p-6 backdrop-blur-xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            {yCol} vs {xCol}
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xCol} type="number" name={xCol} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey={yCol} type="number" name={yCol} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Scatter name="Data" data={scatterData} fill="#10b981" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    } else if (catCols.length > 0 && charts.length < 3) {
      // Distribution Pie Chart
      const catCol = catCols[catCols.length > 1 ? 1 : 0]; // Try second category if exists
      const colProfile = profile.columns.find(c => c.name === catCol.name);
      
      if (colProfile?.top_values && colProfile.top_values.length > 0) {
        const pieData = colProfile.top_values.map(v => ({ name: String(v.value), value: v.count }));
        
        charts.push(
          <div key="pie" className="col-span-1 rounded-3xl border border-white/5 bg-surface/40 p-6 backdrop-blur-xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              Distribution of {catCol.name}
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
    }
    
    // If we still don't have charts, show a generic message
    if (charts.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-12 rounded-3xl border border-white/5 bg-surface/20 text-center">
          <Database className="h-10 w-10 text-slate-500 mb-4" />
          <p className="text-slate-400 font-medium text-lg">Not enough correlatable data.</p>
          <p className="text-slate-500 text-sm mt-2">Try uploading a dataset with numerical and categorical values.</p>
        </div>
      );
    }
    
    return charts;
  };

  const getAiNarrative = () => {
    if (analytics?.ai_insights) {
      return (
        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-cyan-900/20 to-blue-900/10 p-8 backdrop-blur-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              AI Executive Summary
            </span>
          </h3>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{String(analytics.ai_insights)}</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="rounded-3xl border border-white/5 bg-surface/40 p-8 backdrop-blur-xl flex items-start gap-4">
        <Info className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-slate-300">AI narrative temporarily unavailable</p>
          <p className="text-xs text-slate-500 mt-1">
            Displaying deterministic statistics only. Dataset profile contains {profile.row_count} rows across {profile.column_count} columns.
          </p>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8" ref={dashboardRef}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20">
                Generated Dashboard
              </span>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Data
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {selectedDatasetInfo?.name?.split(".")[0] || "Dataset"} Intelligence
            </h1>
            <p className="mt-2 text-slate-400 text-sm">
              Automatically generated visualization dashboard based on deterministic semantic profiling.
            </p>
          </div>
          
          <DashboardExport targetRef={dashboardRef} datasetName={selectedDatasetInfo?.name || "Dataset"} />
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Rows</p>
            <p className="mt-2 text-2xl font-bold text-white">{profile.row_count.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Columns</p>
            <p className="mt-2 text-2xl font-bold text-white">{profile.column_count.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quality Score</p>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-2xl font-bold text-white">{profile.quality_score}</p>
              <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${profile.quality_score >= 80 ? 'bg-emerald-400' : profile.quality_score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                  style={{ width: `${profile.quality_score}%` }}
                />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Missing Data</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {((profile.columns.reduce((acc, col) => acc + col.missing_percentage, 0) / Math.max(profile.columns.length, 1)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* AI Narrative Section */}
        {getAiNarrative()}

        {/* Dynamic Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderCharts()}
        </div>
        
        {/* Quality Section */}
        {profile.quality_issues.length > 0 && (
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-amber-500 flex items-center gap-2 mb-4 uppercase tracking-widest">
              <AlertCircle size={16} /> Data Quality Warnings
            </h3>
            <ul className="space-y-3">
              {profile.quality_issues.slice(0, 4).map((issue, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{issue.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
