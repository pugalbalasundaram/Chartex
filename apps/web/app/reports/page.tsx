import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <section>
        <h1 className="text-4xl font-bold text-white">Reports</h1>
        <p className="mt-2 text-slate-400">
          Generated reports will appear here.
        </p>
      </section>
    </DashboardLayout>
  );
}
