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
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-white/10 bg-slate-900 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h3>

          <p className="mt-2 text-sm text-emerald-400">
            {change}
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          <Icon size={28} />
        </div>
      </div>
    </motion.div>
  );
}