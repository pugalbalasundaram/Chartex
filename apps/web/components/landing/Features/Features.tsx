"use client";

import Container from "@/components/common/Container";
import FeatureCard from "./FeatureCard";
import { features } from "./feature-data";

export default function Features() {
  return (
    <section
      id="features"
      className="bg-slate-950 py-28"
    >
      <Container>

        <div className="mb-16 text-center">

          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            FEATURES
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Everything You Need
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Char(t)ex helps you upload, analyze and visualize your business
            data with AI-powered insights in just a few clicks.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-3">
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
