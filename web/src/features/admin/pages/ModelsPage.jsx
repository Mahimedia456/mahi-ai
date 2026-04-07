import { useEffect, useState } from "react";
import ModelStatCard from "../components/models/ModelStatCard";
import ModelsTable from "../components/models/ModelsTable";
import {
  deleteAdminModel,
  downloadModelsCsv,
  fetchAdminModels,
  fetchAdminModelStats,
  updateAdminModelStatus,
} from "../../../api/adminModelsApi";

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function ModelsPage() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");

  async function loadData() {
    try {
      setLoading(true);

      const [modelsRes, statsRes] = await Promise.all([
        fetchAdminModels(),
        fetchAdminModelStats(),
      ]);

      setItems(modelsRes.items || []);
      setStats(statsRes.stats || null);
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

  async function handleActivate(model) {
    try {
      setActionLoadingId(model.id);
      await updateAdminModelStatus(model.id, "active");
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoadingId("");
    }
  }

  async function handlePause(model) {
    try {
      setActionLoadingId(model.id);
      await updateAdminModelStatus(model.id, "paused");
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoadingId("");
    }
  }

  async function handleDelete(model) {
    const ok = window.confirm(`Delete model "${model.name}"?`);
    if (!ok) return;

    try {
      setActionLoadingId(model.id);
      await deleteAdminModel(model.id);
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoadingId("");
    }
  }

  async function handleExportCsv() {
    try {
      const blob = await downloadModelsCsv();
      downloadBlob(blob, "models.csv");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  if (loading || !stats) {
    return <div className="text-sm text-white">Loading models...</div>;
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
              AI Models
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
              Manage providers, deployments, latency health, success metrics, and operational status.
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
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ModelStatCard title="Total Models" value={stats.totalModels} hint="Registered model endpoints" />
        <ModelStatCard title="Active Models" value={stats.activeModels} hint="Serving production traffic" />
        <ModelStatCard title="Warnings" value={stats.warningModels} hint="Needs review" />
        <ModelStatCard title="Image Leader" value={stats.imageLeader} hint="Highest total demand" />
      </section>

      <ModelsTable
        data={items}
        onActivate={handleActivate}
        onPause={handlePause}
        onDelete={handleDelete}
        actionLoadingId={actionLoadingId}
      />
    </div>
  );
}