"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-2xl transition-all hover:bg-white/[0.05] hover:border-white/[0.1]"
    >
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 transition group-hover:bg-cyan-400 group-hover:text-white">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="mb-4 text-2xl font-bold text-white tracking-tight">
        {title}
      </h3>

      <p className="leading-relaxed text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}