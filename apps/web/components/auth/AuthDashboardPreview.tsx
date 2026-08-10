"use client";

import AreaRevenueChart from "@/components/charts/AreaRevenueChart";

export default function AuthDashboardPreview() {
  return (
    <div className="mt-8 w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-2xl">
      <AreaRevenueChart
        chartData={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: [18, 26, 22, 38, 35, 48],
        }}
      />
    </div>
  );
}
