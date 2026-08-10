"use client";
import HeroChart from "./HeroChart";
import { Card } from "@/components/ui/card";
import { TrendingUp, Database, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <Card className="w-[420px] rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-2xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Revenue</p>
            <h2 className="text-3xl font-bold text-white">$128,540</h2>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            24.8%
          </div>
        </div>

        <HeroChart />

        <div className="grid grid-cols-2 gap-4">

          <Card className="border-white/10 bg-slate-800/70 p-4">
            <Database className="mb-2 text-cyan-400" />
            <p className="text-sm text-slate-400">Datasets</p>
            <h3 className="text-xl font-bold text-white">124</h3>
          </Card>

          <Card className="border-white/10 bg-slate-800/70 p-4">
            <Brain className="mb-2 text-violet-400" />
            <p className="text-sm text-slate-400">AI Accuracy</p>
            <h3 className="text-xl font-bold text-white">98%</h3>
          </Card>

        </div>
      </Card>
    </motion.div>
  );
}