"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 p-4"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl shadow-lg bg-primary text-primary-foreground shadow-[0_0_15px_rgba(34,211,238,0.3)]">
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-surface/50 px-5 py-3 shadow-xl backdrop-blur-md">
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm font-semibold text-slate-300">Thinking</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
