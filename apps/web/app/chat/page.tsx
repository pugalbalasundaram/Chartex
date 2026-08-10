"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ChatInput,
  type ChatMessage,
} from "@/components/chat";
import {
  type ChatResponse,
  getDatasets,
  getDatasetSummary,
  sendChatStream,
} from "@/lib/auth";

const ChatSidebar = dynamic(() => import("@/components/chat/ChatSidebar"), { ssr: false });
const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow"), { ssr: false });

interface Dataset {
  id: number;
  name: string;
  type: string;
  size: number;
  uploaded_at: string;
}

interface DatasetSummary {
  rows: number;
  columns: number;
  missing_values: number;
  duplicates: number;
  numeric_columns: number;
  categorical_columns: number;
  datetime_columns: number;
  memory_usage_mb: number;
  quality_score: number;
}

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content:
  "👋 Welcome to Char(t)ex AI.\n\nUpload or choose a dataset and ask questions in natural language.",

  chartType: null,
  chartData: null,
  tableData: null,
  suggestions: [
    "Summarize this dataset",
    "Find missing values",
    "Show trends",
    "Suggest visualizations",
  ],
};

export default function ChatPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<number | null>(null);
  const [datasetSummary, setDatasetSummary] = useState<DatasetSummary | null>(
    null,
  );
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);

  useEffect(() => {
    async function loadDatasets() {
      try {
        const data = (await getDatasets()) as Dataset[];
        setDatasets(data);

        if (data.length > 0) {
          setSelectedDataset(data[0].id);
        }
      } catch (error) {
        console.error("Unable to load datasets:", error);
      }
    }

    void loadDatasets();
  }, []);

  useEffect(() => {
    async function loadSummary() {
      if (selectedDataset === null) {
        setDatasetSummary(null);
        return;
      }

      try {
        const summary = (await getDatasetSummary(
          selectedDataset,
        )) as DatasetSummary;
        setDatasetSummary(summary);
      } catch (error) {
        console.error("Unable to load dataset summary:", error);
        setDatasetSummary(null);
      }
    }

    void loadSummary();
  }, [selectedDataset]);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      abortControllerRef.current?.abort();
    };
  }, []);

  async function handleSend() {
    const question = prompt.trim();

    if (!question || loading) {
      return;
    }

    // Cancel existing stream if any
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    if (selectedDataset === null) {
      window.alert("Select a dataset first.");
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: question,
        chartType: null,
        chartData: null,
        tableData: null,
        suggestions: [],
      },
      {
        role: "assistant",
        content: "",
        chartType: null,
        chartData: null,
        tableData: null,
        suggestions: [],
      },
    ]);
    setPrompt("");
    setLoading(true);

    try {
      await sendChatStream(
        {
          dataset_id: selectedDataset,
          message: question,
        },
        (chunk) => {
          setMessages((previous) => {
            const newMessages = [...previous];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.content += chunk;
            return newMessages;
          });
        },
        (error) => {
          if (error) {
             setMessages((previous) => {
                const newMessages = [...previous];
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessage.content += `\n\n⚠️ ${error}`;
                return newMessages;
             });
          }
          setLoading(false);
        },
        abortControllerRef.current.signal
      );
    } catch (error) {
        console.error("Stream initialization error:", error);
        setLoading(false);
    }
  }

  function handleRegenerate() {
    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    if (latestUserMessage) {
      setPrompt(latestUserMessage.content);
    }
  }

  return (
    <DashboardLayout>
      <section className="flex h-[calc(100vh-7.5rem)] min-h-[36rem] overflow-hidden rounded-2xl border border-white/[.08] bg-[#0a101a]/70 shadow-2xl shadow-black/20">
        <ChatSidebar
          datasets={datasets}
          selectedDataset={selectedDataset}
          setSelectedDataset={setSelectedDataset}
          datasetSummary={datasetSummary}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/[.08] bg-white/[.02] px-5 py-4">
            <div>
              <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-300 text-xs font-bold text-slate-950">C</span><h1 className="text-base font-semibold text-white">Char(t)ex AI</h1></div>
              <p className="mt-1 text-xs text-slate-500">Your context-aware data analyst</p>
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-medium text-emerald-200">Online</span>
          </header>

          <ChatWindow
            messages={messages}
            loading={loading}
            setPrompt={setPrompt}
            onRegenerate={handleRegenerate}
          />
          <ChatInput
            prompt={prompt}
            setPrompt={setPrompt}
            loading={loading}
            onSend={handleSend}
          />
        </div>
      </section>
    </DashboardLayout>
  );
}
