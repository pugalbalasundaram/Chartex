"use client";

import Container from "@/components/common/Container";
import FAQItem from "./FAQItem";
import { faqs } from "./faq-data";

export default function FAQ() {
  return (
    <section id="faq" className="bg-slate-950 py-28">
      <Container>
        <div className="mb-16 text-center">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            FAQ
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            Everything you need to know about Char(t)ex.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-5">
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
