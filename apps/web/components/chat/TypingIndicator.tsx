"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 p-4"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
        <span className="text-xs font-bold">AI</span>
      </div>
      <div className="flex gap-1.5 rounded-2xl bg-white/[0.05] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-cyan-300"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
