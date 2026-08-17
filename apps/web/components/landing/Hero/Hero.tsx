"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles } from "lucide-react";
import Container from "@/components/common/Container";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background pb-20 pt-32 sm:pt-40">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_55%_at_50%_-15%,rgba(34,211,238,.1),transparent)]" />
      <motion.div animate={{ x: [0, 40, 0], y: [0, 25, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-32 top-32 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <motion.div animate={{ x: [0, -35, 0], y: [0, -25, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-24 top-72 -z-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />

      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Sparkles className="h-3.5 w-3.5" /> Your data, conversational
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08 }} className="mt-8 text-6xl font-extrabold tracking-tighter text-white sm:text-7xl lg:text-9xl">
            Ask better questions.<br /><span className="bg-gradient-to-r from-primary via-white to-blue-500 bg-clip-text text-transparent">Make sharper decisions.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.16 }} className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Char(t)ex turns untidy spreadsheets into clear answers, beautiful analysis, and decisive next steps—in the flow of a simple conversation.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }} className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <MagneticButton>
              <Link href="/dashboard" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]">Start analyzing free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </MagneticButton>
            <MagneticButton>
              <a href="#dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10 hover:border-white/20"><Bot className="h-4 w-4 text-primary" /> See it in action</a>
            </MagneticButton>
          </motion.div>
        </div>
        
        {/* Preview Container */}
        <motion.div initial={{ opacity: 0, y: 48, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.85, delay: 0.25 }} className="relative mx-auto mt-20 max-w-6xl [perspective:1000px]">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/10 blur-3xl" />
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-surface/50 p-4 shadow-2xl backdrop-blur-3xl sm:p-6">
            <div className="rounded-2xl border border-white/5 bg-black/20 p-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex gap-2"><i className="h-3 w-3 rounded-full bg-rose-500/50" /><i className="h-3 w-3 rounded-full bg-amber-400/50" /><i className="h-3 w-3 rounded-full bg-emerald-400/50" /></div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Q2 performance overview</div>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-[1.5fr_.9fr]">
                <div className="rounded-2xl border border-white/5 bg-surface/40 p-8">
                    <p className="text-sm font-semibold text-slate-400">Revenue performance</p>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-white">$842,520 <span className="text-sm font-bold text-emerald-400">+24.8%</span></p>
                    <div className="mt-10 flex h-36 items-end gap-3">{[25,44,36,65,49,78,70,96,82,110,98,128].map((height, index) => <motion.div key={index} initial={{ height: 0 }} animate={{ height }} transition={{ delay: 0.45 + index * .04 }} className="flex-1 rounded-sm bg-gradient-to-t from-primary/30 to-primary" />)}</div>
                </div>
                <div className="space-y-6">
                    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6 shadow-inner shadow-primary/5">
                        <p className="text-xs font-bold uppercase tracking-wider text-primary">AI insight</p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-200">Enterprise accounts are driving 61% of new growth.</p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-surface/40 p-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Ask Char(t)ex</p>
                        <p className="mt-3 text-sm font-semibold text-white">What changed this quarter?</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
