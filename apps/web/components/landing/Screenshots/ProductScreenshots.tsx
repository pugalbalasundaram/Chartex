"use client";

import { motion } from "framer-motion";
import { MessageSquareText, TableProperties } from "lucide-react";
import Container from "@/components/common/Container";

export default function ProductScreenshots() { 
  return (
    <section className="bg-background py-28 sm:py-36">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Product Experience</p>
          <h2 className="mt-6 text-5xl font-extrabold tracking-tighter text-white sm:text-6xl">Every answer has a place.</h2>
          <p className="mt-6 text-lg text-slate-400">Explore, ask, and share without switching between tools.</p>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          <motion.div whileHover={{ y: -8 }} className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-2xl transition-all hover:border-white/[0.1] hover:bg-white/[0.05]">
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8">
              <MessageSquareText className="h-6 w-6 text-cyan-400" />
              <div className="mt-8 rounded-2xl bg-cyan-400/10 p-5 text-sm text-cyan-400 font-medium">Compare monthly retention by customer segment.</div>
              <div className="ml-8 mt-4 rounded-2xl bg-white/[0.02] p-5 text-sm text-slate-300">Retention is strongest in mid-market accounts at 94.2%, up 5.1 points.</div>
            </div>
            <h3 className="mt-8 text-xl font-bold text-white tracking-tight">Natural-language analysis</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">Ask the question you actually mean, then keep exploring.</p>
          </motion.div>

          <motion.div whileHover={{ y: -8 }} className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-2xl transition-all hover:border-white/[0.1] hover:bg-white/[0.05]">
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8">
              <TableProperties className="h-6 w-6 text-indigo-400" />
              <div className="mt-8 space-y-3">
                {["Revenue", "Growth", "Retention", "Health score"].map((x, i) => (
                  <div key={x} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-5 py-3 text-sm">
                    <span className="text-slate-400 font-semibold">{x}</span>
                    <span className="font-bold text-white">{["$842K", "+24.8%", "91.4%", "Excellent"][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <h3 className="mt-8 text-xl font-bold text-white tracking-tight">Context at a glance</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">Keep the raw data and the executive narrative in one coherent place.</p>
          </motion.div>
        </div>
      </Container>
    </section>
  ); 
}

