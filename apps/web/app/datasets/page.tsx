"use client";

import { useEffect, useState } from "react";
import { getDatasets } from "@/lib/api";
import DatasetListTable from "@/components/dataset/DatasetListTable";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dataset/StatsCard";
import Link from "next/link";
import { Plus } from "lucide-react";

interface Dataset { id: number; name: string; type: string; size: number; rows?: number; columns?: number; uploaded_at: string; }

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDatasets() {
      try {
        const data = await getDatasets();
        setDatasets(data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    loadDatasets();
  }, []);

  const totalSize = datasets.reduce((acc, d) => acc + d.size, 0) / 1024 / 1024;
  const totalRows = datasets.reduce((acc, d) => acc + (d.rows ?? 0), 0);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Dataset Explorer</h1>
            <p className="mt-2 text-slate-400">Manage, inspect, and analyze your datasets.</p>
          </div>
          <Link href="/datasets?upload=1" className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
            <Plus className="h-4 w-4" /> Upload Dataset
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <StatsCard title="Datasets" value={datasets.length} />
          <StatsCard title="Total Rows" value={totalRows.toLocaleString()} />
          <StatsCard title="Total Size" value={`${totalSize.toFixed(1)} MB`} />
          <StatsCard title="Recent" value={datasets.length > 0 ? "Active" : "None"} />
        </section>

        <section className="rounded-2xl border border-white/[.08] bg-[#0a101a]/70 p-6">
          <DatasetListTable 
            datasets={datasets} 
            loading={loading} 
            onView={(d) => window.location.href = `/datasets/${d.id}`} 
          />
        </section>
      </motion.div>
    </DashboardLayout>
  );
}
