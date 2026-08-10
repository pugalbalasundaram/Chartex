"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";

const brands = ["Northstar", "Arc", "Vantage", "Luma", "Nexon", "Vertex"];

export default function TrustedBy() {
  return <section className="border-y border-white/8 bg-white/[.018] py-8"><Container><motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-col items-center gap-5 md:flex-row md:justify-between"><p className="text-xs font-medium uppercase tracking-[.18em] text-slate-500">Built for teams that move with clarity</p><div className="flex flex-wrap justify-center gap-x-8 gap-y-3 sm:gap-x-12">{brands.map((brand) => <span key={brand} className="text-base font-semibold tracking-tight text-slate-500 transition hover:text-slate-300">{brand}</span>)}</div></motion.div></Container></section>;
}
