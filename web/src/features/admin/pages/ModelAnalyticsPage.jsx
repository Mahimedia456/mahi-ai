import { useEffect, useState } from "react";
import ModelStatCard from "../components/models/ModelStatCard";
import { fetchAdminModelAnalytics } from "../../../api/adminModelsApi";

function UsageChart({ bars = [] }) {
  const max = Math.max(...bars.map((item) => item.value), 1);

  return (
    <div className="relative mt-8 flex h-64 items-end gap-3">
      {bars.map((item, index) => (
        <div key={index} className="flex flex-1 flex-col items-center justify-end gap-3">
          <div
            className="w-full rounded-t-[12px] bg-[#53f5e7]/20"
            style={{ height: `${(item.value / max) * 100}%` }}
          >
            <div className="h-full w-full rounded-t-[12px] bg-[#53f5e7]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#73807d]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ModelAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetchAdminModelAnalytics();
      setStats(res.stats || null);
      setUsage(res.usage || []);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handlePrintPdf() {
    window.print();
  }

  if (loading || !stats) {
    return <div className="text-sm text-white">Loading model analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
              Model Management
            </p>
            <h1
              className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Model Usage Analytics
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
              Analyze request volumes, throughput, and model demand across production traffic.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
          >
            Export PDF
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ModelStatCard title="Total Requests" value={stats.totalRequests} hint="Lifetime model requests" />
        <ModelStatCard title="Today Requests" value={stats.todayRequests} hint="Requests served today" />
        <ModelStatCard title="Image Leader" value={stats.imageLeader} hint="Highest total demand" />
        <ModelStatCard title="Fastest Avg" value={stats.fastestAvg} hint="Lowest average response time" />
      </section>

      <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <h3
          className="text-[22px] font-bold tracking-[-0.03em] text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          Weekly Request Trend
        </h3>
        <p className="mt-2 text-sm text-[#93a19e]">
          Aggregated weekly model traffic across the active stack.
        </p>
        <UsageChart bars={usage} />
      </div>
    </div>
  );
}