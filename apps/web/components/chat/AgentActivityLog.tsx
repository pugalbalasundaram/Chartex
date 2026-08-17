"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Loader2, AlertTriangle } from "lucide-react";

interface Props {
  logs: string[];
  isComplete: boolean;
  hasError: boolean;
}

export default function AgentActivityLog({ logs, isComplete, hasError }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [timeMs, setTimeMs] = useState(0);

  // Auto-expand while running, collapse when done
  useEffect(() => {
    if (!isComplete && !hasError) {
      setTimeout(() => setExpanded(true), 0);
    } else {
      // Small delay before collapsing when complete to show the final state briefly
      const t = setTimeout(() => setExpanded(false), 800);
      return () => clearTimeout(t);
    }
  }, [isComplete, hasError]);

  // Simple timer
  useEffect(() => {
    if (isComplete || hasError) return;
    const interval = setInterval(() => {
      setTimeMs((prev) => prev + 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isComplete, hasError]);

  if (logs.length === 0 && !hasError) return null;

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-black/40 text-[13px] text-slate-300 shadow-inner">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between bg-white/5 px-4 py-2.5 transition-colors hover:bg-white/10"
      >
        <div className="flex items-center gap-2">
          {hasError ? (
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          ) : isComplete ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          )}
          <span className={`font-medium ${hasError ? "text-rose-200" : isComplete ? "text-emerald-200" : "text-cyan-100"}`}>
            {hasError ? "Analysis interrupted" : isComplete ? "Analysis complete" : "Char(t)ex is analyzing..."}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {(isComplete || hasError) && timeMs > 0 && (
            <span className="font-mono text-xs text-slate-500">{(timeMs / 1000).toFixed(1)}s</span>
          )}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-3 pb-4">
              {logs.map((log, index) => {
                const isLast = index === logs.length - 1;
                const isPending = isLast && !isComplete && !hasError;
                const isFailed = isLast && hasError;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2.5"
                  >
                    {isFailed ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                        <AlertTriangle className="h-2.5 w-2.5" />
                      </div>
                    ) : isPending ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-cyan-500/30">
                        <motion.div 
                          className="h-1.5 w-1.5 rounded-full bg-cyan-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                    )}
                    <span className={`font-mono text-xs ${isFailed ? "text-rose-200/70" : isPending ? "text-cyan-100" : "text-slate-400"}`}>
                      {log}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
