"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles } from "lucide-react";
import Container from "@/components/common/Container";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#05070c] pb-20 pt-36 sm:pt-44">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_55%_at_50%_-15%,rgba(8,145,178,.32),transparent)]" />
      <motion.div animate={{ x: [0, 40, 0], y: [0, 25, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-32 top-32 -z-10 h-96 w-96 rounded-full bg-cyan-500/15 blur-[110px]" />
      <motion.div animate={{ x: [0, -35, 0], y: [0, -25, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-24 top-72 -z-10 h-80 w-80 rounded-full bg-indigo-500/15 blur-[100px]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />

      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" /> Your data, finally conversational
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08 }} className="mt-7 text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
            Ask better questions.<br /><span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">Make sharper decisions.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.16 }} className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
            Char(t)ex turns untidy spreadsheets into clear answers, beautiful analysis, and decisive next steps—in the flow of a simple conversation.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-200">Start analyzing free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            <a href="#dashboard" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[.04] px-6 py-3.5 font-semibold text-white transition hover:bg-white/[.09]"><Bot className="h-4 w-4 text-cyan-300" /> See it in action</a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 48, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.85, delay: 0.25 }} className="relative mx-auto mt-16 max-w-6xl [perspective:1000px]">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-cyan-400/20 blur-3xl" />
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-slate-900/70 p-2 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl sm:p-3">
            <div className="rounded-xl border border-white/10 bg-[#0b101a] p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4"><div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-rose-400" /><i className="h-2.5 w-2.5 rounded-full bg-amber-300" /><i className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div><div className="text-xs text-slate-500">Q2 performance overview</div></div>
              <div className="mt-5 grid gap-4 md:grid-cols-[1.55fr_.9fr]"><div className="rounded-xl border border-white/10 bg-white/[.035] p-5"><p className="text-sm text-slate-400">Revenue performance</p><p className="mt-2 text-3xl font-semibold">$842,520 <span className="text-sm font-medium text-emerald-300">+24.8%</span></p><div className="mt-7 flex h-32 items-end gap-2">{[25,44,36,65,49,78,70,96,82,110,98,128].map((height, index) => <motion.div key={index} initial={{ height: 0 }} animate={{ height }} transition={{ delay: 0.45 + index * .04 }} className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-500/30 to-cyan-300" />)}</div></div><div className="space-y-4"><div className="rounded-xl border border-cyan-300/20 bg-cyan-300/[.07] p-4"><p className="text-xs font-medium text-cyan-200">AI insight</p><p className="mt-2 text-sm leading-6 text-slate-300">Enterprise accounts are driving 61% of new growth.</p></div><div className="rounded-xl border border-white/10 bg-white/[.035] p-4"><p className="text-xs text-slate-500">Ask Char(t)ex</p><p className="mt-2 text-sm text-white">What changed this quarter?</p></div></div></div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
