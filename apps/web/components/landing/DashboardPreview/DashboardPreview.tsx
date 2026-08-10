"use client";

import Container from "@/components/common/Container";
import AreaRevenueChart from "@/components/charts/AreaRevenueChart";
import KPICard from "@/components/cards/KPICard";
import { DollarSign, Users, BrainCircuit } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="bg-slate-950 py-28">
      <Container>
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            LIVE DASHBOARD
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            See Your Data Come Alive
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            Char(t)ex transforms raw business data into interactive dashboards,
            AI-powered insights, and actionable metrics within seconds.
          </p>
        </div>

        {/* Dashboard */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl">
          <div className="space-y-6">
            {/* Top Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Revenue Chart */}
              <div className="lg:col-span-2">
                <AreaRevenueChart
                  chartData={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    values: [42, 55, 48, 67, 72, 86],
                  }}
                />
              </div>

              {/* AI Insights */}
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                <h3 className="text-xl font-semibold text-white">
                  AI Insights
                </h3>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl bg-slate-800 p-4">
                    <p className="text-sm text-cyan-400">Revenue</p>

                    <p className="mt-2 text-slate-300">
                      Revenue increased by <strong>18%</strong> compared to
                      last month.
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-800 p-4">
                    <p className="text-sm text-cyan-400">Recommendation</p>

                    <p className="mt-2 text-slate-300">
                      Focus on enterprise customers to maximize recurring
                      revenue.
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-800 p-4">
                    <p className="text-sm text-cyan-400">Prediction</p>

                    <p className="mt-2 text-slate-300">
                      AI predicts another <strong>12%</strong> growth next
                      month if current trends continue.
                    </p>
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
