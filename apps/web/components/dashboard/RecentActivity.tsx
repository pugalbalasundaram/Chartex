import Link from "next/link";
import { Database, ArrowUpRight } from "lucide-react";

interface Dataset { id: number; name: string; type: string; size: number; uploaded_at: string; }

export default function RecentActivity({ datasets }: { datasets: Dataset[] }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-surface/50 backdrop-blur-xl shadow-xl shadow-black/10 p-6 sm:p-8 transition-all duration-500 hover:border-white/10 hover:shadow-2xl hover:shadow-primary/5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Recent datasets</h2>
          <p className="mt-1 text-sm text-slate-400">Continue where you left off.</p>
        </div>
        <Link href="/datasets" className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">View all</Link>
      </div>
      <div className="mt-6 space-y-3">
        {datasets.length ? (
          datasets.slice(0, 4).map((dataset) => (
            <Link
              href={`/datasets/${dataset.id}`}
              key={dataset.id}
              className="group flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-black/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-400">
                  <Database className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">{dataset.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{dataset.type.toUpperCase()} • {(dataset.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-slate-600 transition group-hover:text-cyan-400" />
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.05] p-10 text-center">
            <Database className="mx-auto h-8 w-8 text-slate-700" />
            <p className="mt-4 text-sm text-slate-400">No datasets yet</p>
            <Link className="mt-2 inline-block text-sm font-semibold text-cyan-400" href="/dashboard?upload=1">Upload your first file</Link>
          </div>
        )}
      </div>
    </div>
  );
}
