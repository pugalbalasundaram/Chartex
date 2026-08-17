"use client";

import Container from "@/components/common/Container";
import AreaRevenueChart from "@/components/charts/AreaRevenueChart";
import KPICard from "@/components/cards/KPICard";
import { DollarSign, Users, BrainCircuit } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="bg-background py-28">
      <Container>
        {/* Section Heading */}
        <div className="mb-20 text-center">
          <span className="rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
            Live Dashboard
          </span>

          <h2 className="mt-8 text-5xl font-extrabold tracking-tighter text-white sm:text-6xl">
            See your data come alive
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400 leading-relaxed">
            Char(t)ex transforms raw business data into interactive dashboards,
            AI-powered insights, and actionable metrics within seconds.
          </p>
        </div>

        {/* Dashboard */}
        <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
          <div className="space-y-8">
            {/* Top Row */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
                <AreaRevenueChart
                  chartData={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    values: [42, 55, 48, 67, 72, 86],
                  }}
                />
              </div>

              {/* AI Insights */}
              <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
                <h3 className="text-xl font-bold text-white tracking-tight">AI Insights</h3>
                <div className="mt-8 space-y-6">
                  <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5">
                    <p className="text-xs font-bold text-cyan-400">Revenue</p>
                    <p className="mt-2 text-sm text-slate-300">Revenue increased by <strong className="text-white">18%</strong> compared to last month.</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5">
                    <p className="text-xs font-bold text-cyan-400">Recommendation</p>
                    <p className="mt-2 text-sm text-slate-300">Focus on enterprise customers to maximize recurring revenue.</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5">
                    <p className="text-xs font-bold text-cyan-400">Prediction</p>
                    <p className="mt-2 text-sm text-slate-300">AI predicts another <strong className="text-white">12%</strong> growth next month.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <KPICard
                title="Revenue"
                value="$64K"
                change="+18.2%"
                icon={DollarSign}
              />

              <KPICard
                title="Active Users"
                value="24.8K"
                change="+9.4%"
                icon={Users}
              />

              <KPICard
                title="AI Accuracy"
                value="98.7%"
                change="+1.3%"
                icon={BrainCircuit}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
