"use client";

import Container from "@/components/common/Container";
import WorkflowCard from "./WorkflowCard";
import { workflow } from "./workflow-data";

export default function Workflow() {
  return (
    <section id="workflow" className="bg-background py-28">
      <Container>
        <div className="mb-20 text-center">
          <span className="rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
            How it works
          </span>
          <h2 className="mt-8 text-5xl font-extrabold tracking-tighter text-white sm:text-6xl">
            From Data to Decisions
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            Upload your business data, let AI analyze it, and receive
            interactive dashboards in just a few seconds.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {workflow.map((item) => (
            <WorkflowCard
              key={item.step}
              step={item.step}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
