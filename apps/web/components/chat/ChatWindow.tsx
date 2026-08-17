"use client";

import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface ChartData {
  labels: string[];
  values: number[];
}

export interface ChatMessage {
  role: "user" | "assistant";

  content: string;

  chartType: string | null;

  chartData: ChartData | null;

  tableData: Record<string, unknown>[] | null;

  generatedCode: string | null;

  suggestions: string[];
}

interface Props {
  messages: ChatMessage[];

  loading: boolean;

  setPrompt: (value: string) => void;
  onRegenerate?: () => void;
}

export default function ChatWindow({
  messages,
  loading,
  setPrompt,
  onRegenerate,
}: Props) {

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-7">

      <div className="mx-auto max-w-4xl space-y-7">

        {messages.map((message, index) => (

          <MessageBubble
            key={index}
            role={message.role}
            content={message.content}
            chartType={message.chartType}
            chartData={message.chartData}
            tableData={message.tableData}
            generatedCode={message.generatedCode}
            suggestions={message.suggestions}
            onSuggestionClick={setPrompt}
            onRegenerate={message.role === "assistant" ? onRegenerate : undefined}
            isComplete={!loading || index !== messages.length - 1}
          />

        ))}

        {loading && (
          <TypingIndicator />
        )}

        <div ref={bottomRef} />

      </div>

    </div>
  );
}
