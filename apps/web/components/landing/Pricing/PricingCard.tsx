"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  popular,
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-3xl border p-8 backdrop-blur-2xl transition-all ${
        popular
          ? "border-cyan-400/50 bg-cyan-400/[0.03]"
          : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.1]"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 right-8 rounded-full bg-cyan-400 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-950">
          Most Popular
        </span>
      )}

      <h3 className="text-xl font-bold text-white tracking-tight">{name}</h3>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-5xl font-extrabold tracking-tighter text-white">{price}</span>
        <span className="text-sm text-slate-500">/mo</span>
      </div>

      <p className="mt-4 text-sm text-slate-400">{description}</p>

      <ul className="mt-8 space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
            <Check className="h-5 w-5 text-cyan-400" />
            {feature}
          </li>
        ))}
      </ul>

      <button className={`mt-10 w-full rounded-xl py-3.5 font-bold transition ${popular ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300" : "bg-white/[0.05] text-white hover:bg-white/[0.1]"}`}>
        Get Started
      </button>
    </motion.div>
  );
}