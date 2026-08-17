"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({
  question,
  answer,
}: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] transition-all hover:border-white/[0.1] hover:bg-white/[0.05]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <span className="text-lg font-bold text-white tracking-tight">
          {question}
        </span>

        <ChevronDown
          className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-slate-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}