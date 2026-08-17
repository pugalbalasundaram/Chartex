import api from "./axios";

export const uploadDataset = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export async function getDatasets() {
  const response = await api.get("/datasets/");
  return response.data;
}

export async function getDatasetPreview(id: number) {
  const response = await api.get(`/datasets/${id}/preview`);
  return response.data;
}

export async function getDatasetSummary(id: number) {
  const response = await api.get(`/datasets/${id}/summary`);
  return response.data;
}

export async function getDatasetProfile(id: number) {
  const response = await api.get(`/datasets/${id}/profile`);
  return response.data;
}

export async function getDatasetAnalytics(id: number) {
  const response = await api.get(`/datasets/${id}/analytics`);
  if (response.status === 202) {
    return { status: "PENDING" };
  }
  return { status: "COMPLETED", data: response.data };
}

export async function getDatasetData(id: number) {
  const response = await api.get(`/datasets/${id}/data`);
  return response.data;
}

export interface ChatRequest {
  dataset_id: number;
  message: string;
  history?: unknown[];
}

export interface ChatResponse {
  answer: string;

  chart_type?: string | null;

  chart_data?: {
    labels: string[];
    values: number[];
  } | null;

  table_data?: Record<string, unknown>[] | null;

  suggestions?: string[];
}

export async function sendChat(data: ChatRequest) {
  const response = await api.post("/chat", data);
  return response.data as ChatResponse;
}

export async function sendChatStream(
  data: ChatRequest,
  onChunk: (chunk: string) => void,
  onPayload: (payload: Record<string, unknown>) => void,
  onDone: (error?: string) => void,
  signal: AbortSignal,
) {
  try {
    const response = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001") + "/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal,
      credentials: "include" // VERY IMPORTANT: Sends cookies (including charex_anon_session)
    });

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        onDone();
        break;
      }
      const chunk = decoder.decode(value, { stream: true });

      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.slice(6);
          if (dataStr === "[DONE]") {
            onDone();
            return;
          }
          if (dataStr === "[HEARTBEAT]") {
            continue;
          }
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.content !== undefined && parsed.content !== null) {
              onChunk(parsed.content);
            }
            onPayload(parsed);
          } catch (e) {
            console.error("Error parsing SSE chunk:", e);
          }
        }
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Chat stream aborted");
      onDone("Stream aborted by user.");
    } else {
      console.error("Chat stream error:", error);
      onDone("Stream interrupted. Please try again.");
    }
  }
}

export interface DatasetProfile {
  row_count: number;
  column_count: number;
  quality_score: number;
  readiness: string;
  columns: Array<{
    name: string;
    semantic_type: string;
    likely_identifier?: boolean;
    dtype: string;
    unique_count: number;
    missing_percentage: number;
    numeric_stats?: {
      min?: number;
      max?: number;
      mean?: number;
      median?: number;
      zero_count: number;
      negative_count: number;
    };
    top_values?: Array<{ value: string; count: number }>;
  }>;
  quality_issues: Array<{ severity: string; column?: string; message: string }>;
  duplicate_summary: { duplicate_rows: number };
  outliers: Array<{ column: string; outlier_count: number; outlier_percentage: number }>;
  correlations: Array<{ column_a: string; column_b: string; correlation: number; strength: string }>;
  recommendations: string[];
  numeric_columns: string[];
  categorical_columns: string[];
  datetime_columns: string[];
  text_columns: string[];
}
