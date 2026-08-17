interface KpiCardProps {
  title: string;
  value: string | number;
}

export default function KpiCard({
  title,
  value,
}: KpiCardProps) {
  return (
    <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8">
      <p className="text-sm font-semibold text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
        {value}
      </h2>
    </div>
  );
}