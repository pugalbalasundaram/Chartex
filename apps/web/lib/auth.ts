import api from "./axios";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export interface LoginData {
  email: string;
  password: string;
}
export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  
  // Store token in cookie
  if (response.data.access_token) {
    document.cookie = `access_token=${response.data.access_token}; path=/; max-age=3600; SameSite=Strict`;
  }
  
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = () => {
  // Clear token cookie on client-side if needed or just redirect
  document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

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

export interface ChatRequest {
  dataset_id: number;
  message: string;
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
  onDone: (error?: string) => void,
  signal: AbortSignal,
) {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  try {
    const response = await fetch("http://127.0.0.1:8000/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      signal,
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
          try {
            const parsed = JSON.parse(dataStr);
            onChunk(parsed.content);
          } catch (e) {
            console.error("Error parsing SSE chunk:", e);
          }
        }
      }
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Chat stream aborted");
      onDone("Stream aborted by user.");
    } else {
      console.error("Chat stream error:", error);
      onDone("Stream interrupted. Please try again.");
    }
  }
}