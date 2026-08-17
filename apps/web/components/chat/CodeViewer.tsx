import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Code, Copy, Check } from "lucide-react";

interface CodeViewerProps {
  code?: string | null;
}

export default function CodeViewer({ code }: CodeViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // If code is not provided by backend yet, we show a fallback.
  const displayCode = code || "# The generated analysis code is not currently available in this version.\n# It is executed securely in the sandbox.";

  async function copyToClipboard(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a101a]/70">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between bg-white/[.02] px-4 py-3 transition-colors hover:bg-white/[.04] outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
      >
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-slate-300">
          <Code className="h-4 w-4 text-slate-400" />
          View generated analysis code
        </div>
        <div className="flex h-5 w-5 items-center justify-center rounded bg-black/20 text-slate-400">
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-t border-white/5"
          >
            <div className="relative group/code">
              <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover/code:opacity-100">
                <button
                  onClick={copyToClipboard}
                  title="Copy Code"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#101825]/90 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="max-h-[300px] overflow-auto p-4 text-xs">
                <pre className="font-mono text-cyan-50/80">
                  <code>{displayCode}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
