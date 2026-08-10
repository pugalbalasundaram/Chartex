"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface WorkflowCardProps {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function WorkflowCard({
  step,
  title,
  description,
  icon: Icon,
}: WorkflowCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-3xl border border-white/10 bg-slate-900 p-8"
    >
      <span className="absolute right-6 top-6 text-4xl font-bold text-white/10">
        {step}
      </span>

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="text-2xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}