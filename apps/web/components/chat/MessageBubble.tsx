"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Check, Copy, RefreshCw, User, Sparkles } from "lucide-react";
import AgentActivityLog from "./AgentActivityLog";
import AnalysisResultCard from "./AnalysisResultCard";

interface ChartData { labels: string[]; values: number[]; }
interface Props { 
  role: "user" | "assistant"; 
  content: string; 
  chartType: string | null; 
  chartData: ChartData | null; 
  tableData: Record<string, unknown>[] | null; 
  generatedCode?: string | null;
  suggestions: string[]; 
  onSuggestionClick: (text: string) => void; 
  onRegenerate?: () => void; 
  isComplete?: boolean;
}

const KNOWN_STATES = [
  { prefix: "> 🤔", label: "Understanding your question" },
  { prefix: "> 💻", label: "Generating Pandas analysis" },
  { prefix: "> ⚙️", label: "Executing securely" },
  { prefix: "> 📝", label: "Preparing insights" }
];

function Content({ content }: { content: string }) { 
  if (!content) return null;
  return (
    <div className="space-y-4 text-[15px] leading-7">
      {content.split(/(```[\s\S]*?```)/g).map((part, index) => 
        part.startsWith("```") ? (
          <div key={index} className="relative group/code my-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2 backdrop-blur-md">
              <span className="text-xs font-semibold text-slate-400">Code</span>
              <button 
                onClick={() => navigator.clipboard.writeText(part.replace(/```/g, "").trim())} 
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <Copy size={12} /> Copy
              </button>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm text-cyan-50">
              <code>{part.replace(/```/g, "").trim()}</code>
            </pre>
          </div>
        ) : (
          <p key={index} className="whitespace-pre-wrap">{part}</p>
        )
      )}
    </div>
  ); 
}

export default function MessageBubble({ 
  role, content, chartType, chartData, tableData, generatedCode, suggestions, onSuggestionClick, onRegenerate, isComplete 
}: Props) { 
  const [copied, setCopied] = useState(false); 
  const isUser = role === "user"; 
  
  async function copy() { 
    await navigator.clipboard.writeText(displayContent); 
    setCopied(true); 
    window.setTimeout(() => setCopied(false), 1400); 
  } 

  let displayContent = content;
  const activityLogs: string[] = [];
  let hasError = false;

  if (!isUser) {
    if (displayContent.includes("⚠️")) {
      hasError = true;
    }

    const lines = displayContent.split('\n');
    const filteredLines = lines.filter(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith("> ")) {
        const state = KNOWN_STATES.find(s => trimmed.startsWith(s.prefix));
        if (state) {
          activityLogs.push(state.label);
        } else {
          activityLogs.push(trimmed.replace(/^> \S+\s*/, ""));
        }
        return false;
      }
      return true;
    });

    displayContent = filteredLines.join('\n').replace(/^\s*---\s*\n+/, '').trim();
  }

  const hasMainContent = !!displayContent || !!chartType || !!tableData || suggestions.length > 0;

  return (
    <motion.article 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl shadow-lg ${isUser ? "bg-white/10 text-white border border-white/10" : "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(34,211,238,0.3)]"}`}>
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>
      
      <div className={`group min-w-0 max-w-[90%] sm:max-w-[80%] ${isUser ? "text-right" : "w-full"}`}>
        {!isUser && activityLogs.length > 0 && (
          <AgentActivityLog 
            logs={activityLogs} 
            isComplete={!!isComplete} 
            hasError={hasError} 
          />
        )}

        {(isUser || hasMainContent) && (
          <>
            {isUser ? (
              <div className="relative overflow-hidden rounded-3xl px-5 py-4 text-left backdrop-blur-md shadow-xl rounded-tr-lg bg-white/5 text-slate-100 border border-white/10">
                <Content content={displayContent} />
              </div>
            ) : (
              <AnalysisResultCard
                insightNode={displayContent ? <Content content={displayContent} /> : null}
                chartType={chartType}
                chartData={chartData}
                tableData={tableData}
                generatedCode={generatedCode}
              />
            )}

            {!isUser && suggestions.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {suggestions.map((item) => (
                  <motion.button 
                    key={item} 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSuggestionClick(item)} 
                    className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs text-primary transition hover:bg-primary/20 hover:border-primary/40"
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            )}
          </>
        )}
        
        {(isUser || hasMainContent) && (
          <div className={`mt-2 flex items-center gap-3 px-1 text-[11px] text-slate-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${isUser ? "justify-end" : ""}`}>
            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-primary" /> Char(t)ex AI</span>
            <button onClick={copy} className="flex items-center gap-1 hover:text-primary">
              {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
            </button>
            {!isUser && onRegenerate && (
              <button onClick={onRegenerate} title="Regenerate response" className="hover:text-primary">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
