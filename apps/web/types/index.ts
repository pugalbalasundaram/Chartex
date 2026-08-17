export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Dataset {
  id: number;
  name: string;
  type: string;
  size: number;
  uploaded_at: string;
  original_filename?: string;
  stored_filename?: string;
  file_type?: string;
  file_size?: number;
}

export interface DatasetProfile {
  rows: number;
  columns: number;
  memory_usage_mb: number;
  missing_values_total: number;
  duplicate_rows: number;
  columns_info: Array<{
    name: string;
    type: string;
    non_null_count: number;
    missing_count: number;
    missing_percentage: number;
    unique_count: number;
  }>;
  numeric_summary: Record<string, unknown>; // Complex nested object
  categorical_summary: Record<string, unknown>;
  health_score: number;
  health_issues: string[];
}

export interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
  title?: string;
  x_axis?: string;
  y_axis?: string;
}

export interface AnalyticsSummary {
  summary: Record<string, string | number>;
  recommended_charts: Array<{
    title: string;
    type: "bar" | "pie" | "line" | "area";
    data: ChartData;
  }>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  chart_type?: string | null;
  chart_data?: ChartData | null;
  table_data?: Record<string, unknown>[] | null;
  suggestions?: string[];
  generated_code?: string | null;
  is_streaming?: boolean;
}
