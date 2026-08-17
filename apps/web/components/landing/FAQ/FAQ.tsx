"use client";

import Container from "@/components/common/Container";
import FAQItem from "./FAQItem";
import { faqs } from "./faq-data";

export default function FAQ() {
  return (
    <section id="faq" className="bg-background py-28">
      <Container>
        <div className="mb-20 text-center">
          <span className="rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
            Frequently Asked Questions
          </span>
          <h2 className="mt-8 text-5xl font-extrabold tracking-tighter text-white sm:text-6xl">
            Need clarity?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            Everything you need to know about Char(t)ex.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
