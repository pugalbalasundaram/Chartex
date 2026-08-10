"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-start"
    >
      <div className="mb-6 flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
        <Sparkles className="h-4 w-4" />
        AI Powered Analytics Platform
      </div>

      <h1 className="max-w-3xl text-5xl font-extrabold leading-tight text-white md:text-7xl">
        Analyze Your Data
        <span className="block bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
          In Seconds
        </span>
      </h1>

      <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
        Upload CSV, Excel or connect your SQL database.
        Char(t)ex automatically generates dashboards,
        KPIs, trends and AI business insights.
      </p>

      <div className="mt-10 flex gap-4">
        <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400">
          Upload Dataset
        </Button>

        <Button variant="outline" size="lg">
          Watch Demo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}