"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";

const brands = ["Northstar", "Arc", "Vantage", "Luma", "Nexon", "Vertex"];

export default function TrustedBy() {
  return (
    <section className="border-y border-border bg-white/[0.01] py-12">
      <Container>
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }} 
          className="flex flex-col items-center gap-8 md:flex-row md:justify-between"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Trusted by data-driven teams
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {brands.map((brand) => (
              <span 
                key={brand} 
                className="text-lg font-bold tracking-tighter text-slate-600 transition hover:text-slate-400"
              >
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
