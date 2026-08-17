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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden rounded-3xl border border-white/5 bg-surface/50 backdrop-blur-xl p-6 shadow-xl shadow-black/10 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-surface/70 hover:shadow-2xl hover:shadow-primary/20"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-white/[0.05] p-2.5">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-white">{value}</p>
        <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
      </div>
    </motion.div>
  );
}

