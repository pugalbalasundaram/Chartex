"use client";

import {
  AlertCircle,
  CheckCircle2,
  Database,
  FileWarning,
  Lightbulb,
  BarChart3,
} from "lucide-react";

interface DatasetSummary {
  rows: number;
  columns: number;
  quality_score: number;
  memory_usage: string;
}

interface MissingReport {
  total_missing: number;
}

interface DuplicateReport {
  duplicate_rows: number;
}

interface InsightsPanelProps {
  summary: DatasetSummary;
  missing: MissingReport;
  duplicates: DuplicateReport;
}

export default function InsightsPanel({
  summary,
  missing,
  duplicates,
}: InsightsPanelProps) {
  const insights: {
    title: string;
    description: string;
    icon: React.ReactNode;
    style: string;
    iconColor: string;
  }[] = [];

  if (summary.quality_score >= 90) {
    insights.push({
      title: "Excellent Data Quality",
      description: "Your dataset is clean and ready for advanced analytics or machine learning.",
      icon: <CheckCircle2 size={20} />,
      style: "border-emerald-500/20 bg-emerald-500/[0.03]",
      iconColor: "text-emerald-400",
    });
  } else if (summary.quality_score >= 70) {
    insights.push({
      title: "Good Dataset",
      description: "Minor preprocessing may improve model performance.",
      icon: <BarChart3 size={20} />,
      style: "border-amber-500/20 bg-amber-500/[0.03]",
      iconColor: "text-amber-400",
    });
  } else {
    insights.push({
      title: "Data Cleaning Recommended",
      description: "Significant preprocessing is recommended before analysis.",
      icon: <AlertCircle size={20} />,
      style: "border-rose-500/20 bg-rose-500/[0.03]",
      iconColor: "text-rose-400",
    });
  }

  if (missing.total_missing > 0) {
    insights.push({
      title: "Missing Values Detected",
      description: `${missing.total_missing} missing values were found. Consider imputation or removing incomplete records.`,
      icon: <FileWarning size={20} />,
      style: "border-orange-500/20 bg-orange-500/[0.03]",
      iconColor: "text-orange-400",
    });
  }

  if (duplicates.duplicate_rows > 0) {
    insights.push({
      title: "Duplicate Records Found",
      description: `${duplicates.duplicate_rows} duplicate rows detected. Removing them can improve analysis accuracy.`,
      icon: <Database size={20} />,
      style: "border-purple-500/20 bg-purple-500/[0.03]",
      iconColor: "text-purple-400",
    });
  }

  insights.push({
    title: "Next Recommendation",
    description: "Explore correlations, distributions, and feature engineering before training ML models.",
    icon: <Lightbulb size={20} />,
    style: "border-cyan-500/20 bg-cyan-500/[0.03]",
    iconColor: "text-cyan-400",
  });

  return (
    <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">AI Insights</h2>
        <p className="mt-1 text-sm text-slate-400">Automatically generated recommendations based on your dataset.</p>
      </div>

      <div className="space-y-4">
        {insights.map((item, index) => (
          <div key={index} className={`rounded-2xl border p-5 ${item.style}`}>
            <div className="flex gap-4">
              <div className={`mt-1 ${item.iconColor}`}>{item.icon}</div>
              <div>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6">
        <h3 className="font-bold text-white tracking-tight">Dataset Overview</h3>
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-slate-400">Rows</p>
            <p className="mt-1 text-2xl font-bold text-white">{summary.rows}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Columns</p>
            <p className="mt-1 text-2xl font-bold text-white">{summary.columns}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Quality Score</p>
            <p className="mt-1 text-2xl font-bold text-white">{summary.quality_score}%</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Memory Usage</p>
            <p className="mt-1 text-2xl font-bold text-white">{summary.memory_usage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}