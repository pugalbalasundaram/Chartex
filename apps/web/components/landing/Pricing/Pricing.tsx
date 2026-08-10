"use client";

import Container from "@/components/common/Container";
import PricingCard from "./PricingCard";
import { plans } from "./plans";

export default function Pricing() {
  return (
    <section id="pricing" className="bg-slate-950 py-28">
      <Container>
        <div className="mb-16 text-center">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            PRICING
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
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
