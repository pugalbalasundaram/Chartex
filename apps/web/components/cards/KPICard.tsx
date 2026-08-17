"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

export default function KPICard({
  title,
  value,
  change,
  icon: Icon,
}: KPICardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-400">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
            {value}
          </h3>

          <p className="mt-2 text-sm font-bold text-emerald-400">
            {change}
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}