"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DashboardMetricCardProps {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  index: number;
}

export default function DashboardMetricCard({
  label,
  value,
  detail,
  icon: Icon,
  index,
}: DashboardMetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border border-white/[.08] bg-white/[.035] p-5 shadow-xl shadow-black/10"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
        <div className="rounded-xl bg-cyan-300/10 p-2.5 text-cyan-200">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
