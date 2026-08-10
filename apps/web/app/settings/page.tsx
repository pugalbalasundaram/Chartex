import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <section>
        <h1 className="text-4xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-slate-400">
          Workspace and account settings will appear here.
        </p>
      </section>
    </DashboardLayout>
  );
}
