"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Check, Copy, RefreshCw, User, Sparkles } from "lucide-react";
import ChartRenderer from "@/components/charts/ChartRenderer";
import TableRenderer from "@/components/tables/TableRenderer";

interface ChartData { labels: string[]; values: number[]; }
interface Props { 
  role: "user" | "assistant"; 
  content: string; 
  chartType: string | null; 
  chartData: ChartData | null; 
  tableData: Record<string, unknown>[] | null; 
  suggestions: string[]; 
  onSuggestionClick: (text: string) => void; 
  onRegenerate?: () => void; 
}

function Content({ content }: { content: string }) { 
  return (
    <div className="space-y-4 text-[15px] leading-7 text-slate-100">
      {content.split(/(```[\s\S]*?```)/g).map((part, index) => 
        part.startsWith("```") ? (
          <pre key={index} className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-sm text-cyan-50 shadow-inner">
            <code>{part.replace(/```/g, "").trim()}</code>
          </pre>
        ) : (
          <p key={index} className="whitespace-pre-wrap">{part}</p>
        )
      )}
    </div>
  ); 
}

export default function MessageBubble({ role, content, chartType, chartData, tableData, suggestions, onSuggestionClick, onRegenerate }: Props) { 
  const [copied, setCopied] = useState(false); 
  const isUser = role === "user"; 
  
  async function copy() { 
    await navigator.clipboard.writeText(content); 
    setCopied(true); 
    window.setTimeout(() => setCopied(false), 1400); 
  } 

  return (
    <motion.article 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl shadow-lg ${isUser ? "bg-violet-500/20 text-violet-200" : "bg-cyan-300 text-slate-950"}`}>
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>
      
      <div className={`group min-w-0 max-w-[90%] sm:max-w-[80%] ${isUser ? "text-right" : ""}`}>
        <div className={`relative overflow-hidden rounded-3xl px-5 py-4 text-left backdrop-blur-sm ${isUser ? "rounded-tr-lg bg-violet-600/10 text-slate-100 ring-1 ring-white/5" : "rounded-tl-lg border border-white/[0.08] bg-white/[0.02] text-slate-200 shadow-xl"}`}>
          <Content content={content} />
          
          {!isUser && (
            <div className="mt-6 space-y-6">
              <ChartRenderer chartType={chartType} chartData={chartData} />
              <TableRenderer tableData={tableData} />
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <motion.button 
                  key={item} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSuggestionClick(item)} 
                  className="rounded-full border border-cyan-200/20 bg-cyan-950/30 px-4 py-1.5 text-xs text-cyan-100 transition hover:bg-cyan-900/50"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          )}
        </div>
        
        <div className={`mt-2 flex items-center gap-3 px-1 text-[11px] text-slate-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${isUser ? "justify-end" : ""}`}>
          <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Char(t)ex AI</span>
          <button onClick={copy} className="flex items-center gap-1 hover:text-cyan-200">
            {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
          </button>
          {!isUser && onRegenerate && (
            <button onClick={onRegenerate} title="Regenerate response" className="hover:text-cyan-200">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
