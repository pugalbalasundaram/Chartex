"use client";

import { motion } from "framer-motion";
import { BrainCircuit, ChartNoAxesCombined, FileSearch, Sparkles } from "lucide-react";
import Container from "@/components/common/Container";

const items = [
  { icon: FileSearch, title: "Understand every column", text: "Profile quality, types, gaps, and outliers before they become a blind spot." }, 
  { icon: BrainCircuit, title: "Reason with your data", text: "Use plain language to uncover the why behind every metric and movement." }, 
  { icon: ChartNoAxesCombined, title: "Tell the story visually", text: "Generate crisp charts and tables that make the signal unmistakable." }
];

export default function Capabilities() { 
  return (
    <section className="relative py-28 sm:py-36 bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_40%,rgba(124,92,255,0.08),transparent_28%)]" />
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" /> Intelligence, without the busywork
            </div>
            <h2 className="mt-8 text-5xl font-extrabold tracking-tighter text-white sm:text-6xl">
              A thoughtful analyst for every team.
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-slate-400">
              From the first upload to the final recommendation, Char(t)ex makes complex analysis feel composed, quick, and human.
            </p>
          </div>
          
          <div className="grid gap-6">
            {items.map((item, i) => { 
              const Icon = item.icon; 
              return (
                <motion.article 
                  key={item.title} 
                  initial={{ opacity: 0, x: 20 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.15 }} 
                  className="group flex gap-6 rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8 transition-all hover:bg-white/[0.05] hover:border-white/[0.1]"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 transition group-hover:bg-indigo-500 group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                    <p className="mt-3 leading-relaxed text-slate-400">{item.text}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  ); 
}
