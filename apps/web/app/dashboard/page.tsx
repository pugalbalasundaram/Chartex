"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Database, FileUp, MessageSquareText, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import { getDatasets } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Dataset { id: number; name: string; type: string; size: number; uploaded_at: string; }

const actions = [{ label: "Upload dataset", href: "/upload", icon: FileUp, description: "CSV or Excel" }, { label: "Ask Char(t)ex", href: "/chat", icon: MessageSquareText, description: "Explore with AI" }];

export default function DashboardPage() {
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    async function load() { 
      try { 
        const datasetList = await getDatasets(); 
        setDatasets(datasetList as Dataset[]); 
      } catch (error) { 
        console.error("Unable to load workspace:", error); 
      } finally { 
        setLoading(false); 
      } 
    } 
    void load(); 
  }, [router]);

  if (loading) return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.55fr_.85fr]">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </DashboardLayout>
  );

  const storage = datasets.reduce((total, dataset) => total + dataset.size, 0) / 1024 / 1024;
  const metrics = [{ label: "Datasets", value: datasets.length, detail: "Ready to explore", icon: Database }, { label: "Storage used", value: `${storage.toFixed(1)} MB`, detail: "Across your workspace", icon: FileUp }, { label: "AI conversations", value: "—", detail: "Start your first analysis", icon: Sparkles }];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-7">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-cyan-200">Your workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Good to see you <span aria-hidden>👋</span></h1>
            <p className="mt-2 text-slate-400">Here’s what’s happening across your data today.</p>
          </div>
          <Link href="/upload" className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
            <Plus className="h-4 w-4" /> New dataset
          </Link>
        </motion.section>
        
        <section className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric, index) => (
            <DashboardMetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              detail={metric.detail}
              icon={metric.icon}
              index={index}
            />
          ))}
        </section>
        
        <section className="grid gap-5 lg:grid-cols-[1.55fr_.85fr]">
          <RecentActivity datasets={datasets} />
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-surface/50 backdrop-blur-xl p-6 shadow-xl shadow-black/10 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[80px]" />
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-white tracking-tight">What would you like to uncover?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Upload data, ask a question, and let Char(t)ex handle the analysis.</p>
              <div className="mt-8 space-y-3">
                {actions.map((action) => { 
                  const Icon = action.icon; 
                  return (
                    <Link key={action.label} href={action.href} className="group flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-black/40 hover:shadow-lg hover:shadow-primary/10">
                      <div className="flex items-center gap-4">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-semibold text-white">{action.label}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{action.description}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-slate-600 transition group-hover:text-primary" />
                    </Link> 
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
