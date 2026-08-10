"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/common/Container";

export default function CTA() { return <section className="pb-28 pt-8 sm:pb-36"><Container><motion.div whileHover={{ scale: 1.005 }} className="relative overflow-hidden rounded-3xl border border-cyan-200/20 bg-gradient-to-br from-cyan-400/20 via-[#101b2a] to-violet-500/20 px-7 py-16 text-center sm:px-16"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.12),transparent_45%)]" /><div className="relative"><p className="text-sm font-medium text-cyan-100">READY WHEN YOU ARE</p><h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-.045em] sm:text-6xl">Meet the calmest way to understand your data.</h2><p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">Start with your next spreadsheet. Leave with the answer everyone needs.</p><Link href="/register" className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-100">Create your workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div></motion.div></Container></section>; }
