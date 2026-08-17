"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/common/Container";

export default function CTA() { 
  return (
    <section className="py-28 bg-background">
      <Container>
        <motion.div 
          whileHover={{ scale: 1.002 }} 
          className="relative overflow-hidden rounded-[3rem] border border-white/[0.05] bg-white/[0.02] p-16 text-center shadow-2xl backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-indigo-500/10" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Ready when you are</p>
            <h2 className="mx-auto mt-8 max-w-3xl text-5xl font-extrabold tracking-tighter text-white sm:text-6xl">
              Meet the calmest way to understand your data.
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-lg text-slate-400 leading-relaxed">
              Start with your next spreadsheet. Leave with the answer everyone needs.
            </p>
            <Link href="/dashboard" className="group mt-12 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-400">
              Create your workspace <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  ); 
}
