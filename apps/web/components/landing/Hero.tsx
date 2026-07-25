"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black px-6">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl text-center"
      >
        <h1 className="text-5xl font-extrabold leading-tight text-white md:text-7xl">
          Transform Your Data Into
          <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI-Powered Insights
          </span>
        </h1>

        <p className="mt-6 text-lg text-slate-300 md:text-xl">
          Upload CSV, Excel, or SQL datasets and let Charex generate
          interactive dashboards, charts, KPIs, and intelligent business
          insights in seconds.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg">
            Upload Dataset
          </Button>

          <Button variant="outline" size="lg">
            Try Demo
          </Button>
        </div>
      </motion.div>

    </section>
  );
}