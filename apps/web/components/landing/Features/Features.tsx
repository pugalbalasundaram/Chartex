"use client";

import Container from "@/components/common/Container";
import FeatureCard from "./FeatureCard";
import { features } from "./feature-data";

export default function Features() {
  return (
    <section id="features" className="bg-background py-28">
      <Container>
        <div className="mb-20 text-center">
          <span className="rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
            Platform Capabilities
          </span>
          <h2 className="mt-8 text-5xl font-extrabold tracking-tighter text-white sm:text-6xl">
            Everything You Need
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Char(t)ex helps you upload, analyze, and visualize your business
            data with AI-powered insights in just a few clicks.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
