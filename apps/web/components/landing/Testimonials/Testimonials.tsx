"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";

const testimonials = [
  { quote: "Char(t)ex gives our whole team the confidence to go from question to answer in minutes.", name: "Maya Chen", role: "VP Operations · Northstar" }, 
  { quote: "It feels less like another dashboard and more like having an exceptional analyst on call.", name: "Daniel Reed", role: "Head of Growth · Vantage" }
];

export default function Testimonials() { 
  return (
    <section className="py-28 sm:py-36 bg-background">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">What teams are saying</p>
            <h2 className="mt-6 text-5xl font-extrabold tracking-tighter text-white sm:text-6xl">Clarity compounds.</h2>
          </div>
          <p className="max-w-sm text-slate-400 leading-relaxed">
            Real customer stories that highlight the value and impact of Char(t)ex on team efficiency.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {testimonials.map((testimonial, i) => (
            <motion.figure 
              key={testimonial.name} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.15 }} 
              className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-10 backdrop-blur-2xl"
            >
              <blockquote className="text-xl leading-relaxed text-slate-100 italic">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600" />
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  ); 
}

