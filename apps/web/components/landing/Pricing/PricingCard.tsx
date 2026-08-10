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
      transition={{ duration: 0.25 }}
      className={`relative rounded-3xl border p-8 ${
        popular
          ? "border-cyan-400 bg-slate-900"
          : "border-white/10 bg-slate-900/70"
      }`}
    >
      {popular && (
        <span className="absolute right-6 top-6 rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}

      <h3 className="text-2xl font-bold text-white">{name}</h3>

      <p className="mt-4 text-5xl font-bold text-cyan-400">{price}</p>

      <p className="mt-3 text-slate-400">{description}</p>

      <ul className="mt-8 space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-slate-300">
            <Check className="h-5 w-5 text-cyan-400" />
            {feature}
          </li>
        ))}
      </ul>

      <button className="mt-8 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600">
        Get Started
      </button>
    </motion.div>
  );
}