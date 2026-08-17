"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ChatInput,
  type ChatMessage,
} from "@/components/chat";
import {
  getDatasets,
  getDatasetSummary,
  getDatasetPreview,
  getDatasetProfile,
  type DatasetProfile,
  sendChatStream,
  getDatasetAnalytics,
} from "@/lib/api";
import { Menu } from "lucide-react";
import MobileNav from "@/components/chat/MobileNav";

const ChatSidebar = dynamic(() => import("@/components/chat/ChatSidebar"), { ssr: false });
const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow"), { ssr: false });

interface Dataset {
  id: number;
  name: string;
  type: string;
  size: number;
  uploaded_at: string;
}

export interface DatasetSummary {
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

export interface ColumnProfile {
  name: string;
  dtype: string;
  missing: number;
  unique: number;
  null_percentage: number;
}

export interface DatasetPreview {
  column_profile: ColumnProfile[];
}

export default function ChatPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<number | null>(null);
  const [datasetSummary, setDatasetSummary] = useState<DatasetSummary | null>(null);
  const [datasetPreview, setDatasetPreview] = useState<DatasetPreview | null>(null);
  const [datasetProfile, setDatasetProfile] = useState<DatasetProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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

  useEffect(() => {
    async function loadPreview() {
      if (selectedDataset === null) {
        setDatasetPreview(null);
        return;
      }
      try {
        const preview = await getDatasetPreview(selectedDataset);
        setDatasetPreview(preview);
      } catch (error) {
        console.error("Unable to load dataset preview:", error);
        setDatasetPreview(null);
      }
    }
    void loadPreview();
  }, [selectedDataset]);

  useEffect(() => {
    async function loadProfile() {
      // Invalidate stale profile immediately
      setDatasetProfile(null);
      setProfileError(null);
      
      if (selectedDataset === null) {
        setIsProfileLoading(false);
        return;
      }
      
      setIsProfileLoading(true);
      try {
        const profile = await getDatasetProfile(selectedDataset);
        setDatasetProfile(profile);
      } catch (error) {
        console.error("Unable to load dataset profile:", error);
        setProfileError("Dataset intelligence is temporarily unavailable.");
      } finally {
        setIsProfileLoading(false);
      }
    }
    void loadProfile();
  }, [selectedDataset]);

  useEffect(() => {
    let isPolling = true;

    async function fetchInitialAnalytics() {
      if (selectedDataset === null) {
        setMessages([]);
        return;
      }

      setMessages([{
        role: "assistant",
        content: "Analyzing your dataset...",
        chartType: null,
        chartData: null,
        tableData: null,
        generatedCode: null,
        suggestions: [],
      }]);

      try {
        while (isPolling) {
          const res = await getDatasetAnalytics(selectedDataset);
          
          if (res.status === "PENDING") {
            await new Promise((resolve) => setTimeout(resolve, 3000));
          } else if (res.status === "COMPLETED") {
            if (isPolling) {
              setMessages([{
                role: "assistant",
                content: res.data?.ai_insights || "Analysis complete.",
                chartType: null,
                chartData: null,
                tableData: null,
                generatedCode: null,
                suggestions: res.data.suggested_questions || [],
              }]);
            }
            break;
          } else {
            break;
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial analytics:", error);
        if (isPolling) {
          setMessages([{
            role: "assistant",
            content: "Welcome to Char(t)ex AI. I am ready to help you analyze your data.",
            chartType: null,
            chartData: null,
            tableData: null,
            generatedCode: null,
            suggestions: [],
          }]);
        }
      }
    }

    void fetchInitialAnalytics();

    return () => {
      isPolling = false;
    };
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
        generatedCode: null,
        suggestions: [],
      },
      {
        role: "assistant",
        content: "",
        chartType: null,
        chartData: null,
        tableData: null,
        generatedCode: null,
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
        (chunk: string) => {
          setMessages((previous) => {
            const newMessages = [...previous];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.content += chunk;
            return newMessages;
          });
        },
        (payload: Record<string, unknown>) => {
          setMessages((previous) => {
            const newMessages = [...previous];
            const lastMessage = newMessages[newMessages.length - 1];
            if (payload.chart_type) lastMessage.chartType = payload.chart_type as string;
            if (payload.chart_data) lastMessage.chartData = payload.chart_data as unknown as import("@/types").ChartData;
            if (payload.table_data) lastMessage.tableData = payload.table_data as Record<string, unknown>[];
            if (payload.generated_code) lastMessage.generatedCode = payload.generated_code as string;
            if (payload.suggestions) lastMessage.suggestions = payload.suggestions as string[];
            return newMessages;
          });
        },
        (error?: string) => {
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
        
        {/* Mobile Nav Drawer */}
        <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)}>
          <ChatSidebar
            datasets={datasets}
            selectedDataset={selectedDataset}
            setSelectedDataset={(id) => {
              setSelectedDataset(id);
              setIsMobileNavOpen(false);
            }}
            datasetSummary={datasetSummary}
            datasetPreview={datasetPreview}
            datasetProfile={datasetProfile}
            isProfileLoading={isProfileLoading}
            profileError={profileError}
          />
        </MobileNav>

        {/* Desktop Sidebar */}
        <div className="hidden xl:block">
          <ChatSidebar
            datasets={datasets}
            selectedDataset={selectedDataset}
            setSelectedDataset={setSelectedDataset}
            datasetSummary={datasetSummary}
            datasetPreview={datasetPreview}
            datasetProfile={datasetProfile}
            isProfileLoading={isProfileLoading}
            profileError={profileError}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/[.08] bg-white/[.02] px-5 py-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileNavOpen(true)}
                className="flex items-center justify-center h-9 w-9 rounded-md border border-white/10 bg-white/5 text-slate-300 xl:hidden hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Open datasets menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-300 text-xs font-bold text-slate-950">C</span><h1 className="text-base font-semibold text-white">Char(t)ex AI</h1></div>
                <p className="mt-1 text-xs text-slate-500">
                  {datasets.find(d => d.id === selectedDataset)?.name ? `${datasets.find(d => d.id === selectedDataset)?.name} • ` : ""} 
                  {datasetSummary ? `${datasetSummary.rows.toLocaleString()} rows` : "Your context-aware data analyst"}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-medium text-emerald-200">Online</span>
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
