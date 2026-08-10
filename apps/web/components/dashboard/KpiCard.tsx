interface KpiCardProps {
  title: string;
  value: string | number;
}

export default function KpiCard({
  title,
  value,
}: KpiCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </h2>
    </div>
  );
}