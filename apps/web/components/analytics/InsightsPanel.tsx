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
    color: string;
  }[] = [];

  if (summary.quality_score >= 90) {
    insights.push({
      title: "Excellent Data Quality",
      description:
        "Your dataset is clean and ready for advanced analytics or machine learning.",
      icon: <CheckCircle2 size={20} />,
      color: "border-green-500 bg-green-50",
    });
  } else if (summary.quality_score >= 70) {
    insights.push({
      title: "Good Dataset",
      description:
        "Minor preprocessing may improve model performance.",
      icon: <BarChart3 size={20} />,
      color: "border-yellow-500 bg-yellow-50",
    });
  } else {
    insights.push({
      title: "Data Cleaning Recommended",
      description:
        "Significant preprocessing is recommended before analysis.",
      icon: <AlertCircle size={20} />,
      color: "border-red-500 bg-red-50",
    });
  }

  if (missing.total_missing > 0) {
    insights.push({
      title: "Missing Values Detected",
      description: `${missing.total_missing} missing values were found. Consider imputation or removing incomplete records.`,
      icon: <FileWarning size={20} />,
      color: "border-orange-500 bg-orange-50",
    });
  }

  if (duplicates.duplicate_rows > 0) {
    insights.push({
      title: "Duplicate Records Found",
      description: `${duplicates.duplicate_rows} duplicate rows detected. Removing them can improve analysis accuracy.`,
      icon: <Database size={20} />,
      color: "border-purple-500 bg-purple-50",
    });
  }

  insights.push({
    title: "Next Recommendation",
    description:
      "Explore correlations, distributions, and feature engineering before training ML models.",
    icon: <Lightbulb size={20} />,
    color: "border-blue-500 bg-blue-50",
  });

  return (
    <div className="rounded-xl border bg-white p-6 shadow">

      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          AI Insights
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Automatically generated recommendations based on your dataset.
        </p>
      </div>

      <div className="space-y-4">

        {insights.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl border-l-4 p-4 ${item.color}`}
          >
            <div className="flex gap-3">

              <div className="mt-1">
                {item.icon}
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-gray-700">
                  {item.description}
                </p>
              </div>

            </div>
          </div>
        ))}

      </div>

      <div className="mt-8 rounded-xl bg-gray-50 p-5">

        <h3 className="font-semibold text-lg">
          Dataset Overview
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-4">

          <div>
            <p className="text-sm text-gray-500">
              Rows
            </p>

            <p className="text-2xl font-bold">
              {summary.rows}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Columns
            </p>

            <p className="text-2xl font-bold">
              {summary.columns}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Quality Score
            </p>

            <p className="text-2xl font-bold">
              {summary.quality_score}%
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Memory Usage
            </p>

            <p className="text-2xl font-bold">
              {summary.memory_usage}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}