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
      transition={{ duration: 0.25 }}
      className="group rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl"
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 transition group-hover:bg-cyan-500 group-hover:text-white">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="mb-3 text-2xl font-semibold text-white">
        {title}
      </h3>

      <p className="leading-7 text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}