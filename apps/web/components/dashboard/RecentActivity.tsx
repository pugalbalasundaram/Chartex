import Link from "next/link";
import { Database, ArrowUpRight } from "lucide-react";

interface Dataset { id: number; name: string; type: string; size: number; uploaded_at: string; }

export default function RecentActivity({ datasets }: { datasets: Dataset[] }) {
  return (
    <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent datasets</h2>
          <p className="mt-1 text-sm text-slate-500">Continue where you left off.</p>
        </div>
        <Link href="/datasets" className="text-sm text-cyan-200 hover:text-cyan-100">View all</Link>
      </div>
      <div className="mt-5 space-y-2">
        {datasets.length ? (
          datasets.slice(0, 4).map((dataset) => (
            <Link
              href="/chat"
              key={dataset.id}
              className="group flex items-center justify-between rounded-xl border border-transparent bg-white/[.025] p-3.5 transition hover:border-white/[.08] hover:bg-white/[.06]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg bg-violet-400/10 p-2 text-violet-200">
                  <Database className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-200">{dataset.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{dataset.type.toUpperCase()} · {(dataset.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:text-cyan-200" />
            </Link>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
            <Database className="mx-auto h-6 w-6 text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">No datasets yet</p>
            <Link className="mt-2 inline-block text-sm text-cyan-200" href="/upload">Upload your first file</Link>
          </div>
        )}
      </div>
    </div>
  );
}
