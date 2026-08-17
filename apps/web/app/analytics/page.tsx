import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <section className="mb-8">
        <h1 className="text-4xl font-bold text-white">Analytics</h1>
        <p className="mt-2 text-slate-400">
          Choose a dataset to explore its analysis and visualizations.
        </p>
      </section>
      <AnalyticsDashboard />
    </DashboardLayout>
  );
}
