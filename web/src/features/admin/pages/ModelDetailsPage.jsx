import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ModelDetailTabs from "../components/models/ModelDetailTabs";
import {
  downloadModelUsageCsv,
  fetchAdminModelDetail,
  updateAdminModelStatus,
} from "../../../api/adminModelsApi";

function Panel({ title, subtitle, children }) {
  return (
    <div className="rounded-[26px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
      <h3
        className="text-[20px] font-bold tracking-[-0.03em] text-white"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        {title}
      </h3>
      {subtitle ? <p className="mt-2 text-sm text-[#93a19e]">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
      <span className="text-sm text-[#93a19e]">{label}</span>
      <span className="text-sm font-medium text-white">{value || "-"}</span>
    </div>
  );
}

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

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function ModelDetailPage() {
  const { modelId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [model, setModel] = useState(null);
  const [usage, setUsage] = useState([]);
  const [activity, setActivity] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  async function loadData() {
    try {
      const res = await fetchAdminModelDetail(modelId);
      setModel(res.model || null);
      setUsage(res.usage || []);
      setActivity(res.activity || []);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [modelId]);

  async function handleActivate() {
    try {
      setActionLoading(true);
      await updateAdminModelStatus(modelId, "active");
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePause() {
    try {
      setActionLoading(true);
      await updateAdminModelStatus(modelId, "paused");
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleExportCsv() {
    try {
      const blob = await downloadModelUsageCsv(modelId);
      downloadBlob(blob, "model-usage.csv");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function handleExportPdf() {
    window.print();
  }

  if (!model) {
    return <div className="text-sm text-white">Loading model details...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link to="/admin/models" className="text-xs font-semibold text-[#53f5e7]">
              ← Back to models
            </Link>
            <h1
              className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              {model.name}
            </h1>
            <p className="mt-2 text-sm text-[#9eaaa7]">
              {model.provider} · {model.type} · {model.status}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
            >
              Export CSV
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
            >
              Export PDF
            </button>

            {model.status !== "active" ? (
              <button
                disabled={actionLoading}
                onClick={handleActivate}
                className="rounded-2xl bg-[#53f5e7] px-5 py-3 text-sm font-bold text-black disabled:opacity-60"
              >
                Activate
              </button>
            ) : (
              <button
                disabled={actionLoading}
                onClick={handlePause}
                className="rounded-2xl bg-yellow-500/10 px-5 py-3 text-sm font-bold text-yellow-300 disabled:opacity-60"
              >
                Pause
              </button>
            )}
          </div>
        </div>
      </section>

      <ModelDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Model Overview" subtitle="Deployment and serving configuration.">
            <DataRow label="Provider" value={model.provider} />
            <DataRow label="Type" value={model.type} />
            <DataRow label="Version" value={model.version} />
            <DataRow label="Deployment" value={model.deployment} />
            <DataRow label="Endpoint" value={model.endpoint} />
            <DataRow label="Status" value={model.status} />
          </Panel>

          <Panel title="Performance Summary" subtitle="Request and reliability metrics.">
            <DataRow label="Avg Latency" value={model.avgLatency} />
            <DataRow label="Success Rate" value={model.successRate} />
            <DataRow label="Total Requests" value={model.totalRequests} />
            <DataRow label="Today Requests" value={model.todayRequests} />
            <DataRow label="Last Used" value={model.lastUsedAt} />
          </Panel>
        </div>
      )}

      {activeTab === "usage" && (
        <Panel title="Usage Trend" subtitle="Last 7 days request volume for this model.">
          <UsageChart bars={usage} />
        </Panel>
      )}

      {activeTab === "config" && (
        <Panel title="Model Config" subtitle="Stored runtime configuration.">
          <pre className="overflow-x-auto rounded-2xl border border-white/5 bg-[#151515] p-5 text-sm text-[#d2dbd9]">
            {JSON.stringify(model.config || {}, null, 2)}
          </pre>
        </Panel>
      )}

      {activeTab === "activity" && (
        <Panel title="Model Activity" subtitle="Recent administrative actions and events.">
          <div className="space-y-3">
            {activity.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#151515] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm text-white">{entry.action}</p>
                  <p className="mt-1 text-xs text-[#8f9d99]">{entry.actorName}</p>
                </div>
                <span className="text-xs text-[#8f9d99]">{entry.createdAt}</span>
              </div>
            ))}

            {!activity.length && (
              <div className="rounded-2xl border border-white/5 bg-[#151515] p-4 text-sm text-[#8f9d99]">
                No activity found for this model.
              </div>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}