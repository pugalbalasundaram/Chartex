
import ChartRenderer from "@/components/charts/ChartRenderer";
import TableRenderer from "@/components/tables/TableRenderer";
import CodeViewer from "./CodeViewer";

interface ChartData {
  labels: string[];
  values: number[];
}

interface AnalysisResultCardProps {
  insightNode: React.ReactNode;
  chartType: string | null;
  chartData: ChartData | null;
  tableData: Record<string, unknown>[] | null;
  generatedCode?: string | null;
}

export default function AnalysisResultCard({
  insightNode,
  chartType,
  chartData,
  tableData,
  generatedCode,
}: AnalysisResultCardProps) {
  
  const hasChart = !!chartType && chartType !== "none" && !!chartData;
  const hasTable = !!tableData && tableData.length > 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-surface/40 shadow-2xl backdrop-blur-md">
      
      {/* AI INSIGHT SECTION */}
      {insightNode && (
        <div className="p-5 sm:p-6">
          <h3 className="mb-4 text-[10px] font-bold tracking-widest text-cyan-400/80 uppercase">
            AI Insight
          </h3>
          <div className="text-sm leading-relaxed text-slate-200">
            {insightNode}
          </div>
        </div>
      )}

      {/* VISUALIZATION SECTION */}
      {hasChart && (
        <div className="border-t border-white/5 bg-[#0a101a]/40 p-5 sm:p-6">
          <h3 className="mb-4 text-[10px] font-bold tracking-widest text-emerald-400/80 uppercase">
            Visualization
          </h3>
          <ChartRenderer chartType={chartType} chartData={chartData} />
        </div>
      )}

      {/* DATA EVIDENCE SECTION */}
      {hasTable && (
        <div className="border-t border-white/5 bg-[#0a101a]/60 p-5 sm:p-6">
          <h3 className="mb-4 text-[10px] font-bold tracking-widest text-purple-400/80 uppercase">
            Data Evidence
          </h3>
          <TableRenderer tableData={tableData} />
        </div>
      )}

      {/* ANALYSIS DETAILS SECTION */}
      {(hasChart || hasTable) && (
        <div className="border-t border-white/5 bg-[#0a101a]/80 p-5 sm:p-6">
          <h3 className="mb-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Analysis Details
          </h3>
          <CodeViewer code={generatedCode} />
        </div>
      )}

    </div>
  );
}
