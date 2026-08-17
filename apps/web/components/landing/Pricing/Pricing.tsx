"use client";

import Container from "@/components/common/Container";
import PricingCard from "./PricingCard";
import { plans } from "./plans";

export default function Pricing() {
  return (
    <section id="pricing" className="bg-background py-28">
      <Container>
        <div className="mb-20 text-center">
          <span className="rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
            Pricing Plans
          </span>

          <h2 className="mt-8 text-5xl font-extrabold tracking-tighter text-white sm:text-6xl">
            Simple Pricing
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            Choose a plan that fits your needs. Upgrade anytime as your business grows.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>
      </Container>
    </section>
  );
}
