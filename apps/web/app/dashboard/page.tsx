"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Database, FileUp, MessageSquareText, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import { getCurrentUser, getDatasets, logoutUser } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface User { id: number; username: string; email: string; }
interface Dataset { id: number; name: string; type: string; size: number; uploaded_at: string; }

const actions = [{ label: "Upload dataset", href: "/upload", icon: FileUp, description: "CSV or Excel" }, { label: "Ask Char(t)ex", href: "/chat", icon: MessageSquareText, description: "Explore with AI" }];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { async function load() { try { const [profile, datasetList] = await Promise.all([getCurrentUser(), getDatasets()]); setUser(profile); setDatasets(datasetList as Dataset[]); } catch (error) { console.error("Unable to load workspace:", error); logoutUser(); router.replace("/login"); } finally { setLoading(false); } } void load(); }, [router]);

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

  return <DashboardLayout><div className="mx-auto max-w-7xl space-y-7"><motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm text-cyan-200">Your workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Good to see you, {user?.username} <span aria-hidden>👋</span></h1><p className="mt-2 text-slate-400">Here’s what’s happening across your data today.</p></div><Link href="/upload" className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"><Plus className="h-4 w-4" /> New dataset</Link></motion.section>
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
      <div className="rounded-2xl border border-cyan-200/15 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.16),transparent_50%)] p-5 sm:p-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300 text-slate-950"><Sparkles className="h-5 w-5" /></div><h2 className="mt-5 text-xl font-semibold text-white">What would you like to uncover?</h2><p className="mt-2 text-sm leading-6 text-slate-400">Upload data, ask a question, and let Char(t)ex handle the analysis.</p><div className="mt-6 space-y-2">{actions.map((action) => { const Icon = action.icon; return <Link key={action.label} href={action.href} className="group flex items-center justify-between rounded-xl border border-white/[.08] bg-[#0b121e]/70 p-3.5 transition hover:border-cyan-200/30"><div className="flex items-center gap-3"><Icon className="h-4 w-4 text-cyan-200" /><div><p className="text-sm font-medium text-white">{action.label}</p><p className="text-xs text-slate-500">{action.description}</p></div></div><ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:text-cyan-200" /></Link> })}</div></div></section>
  </div></DashboardLayout>;
}
