import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ContentStatCard from "../components/content/ContentStatCard";
import ContentTable from "../components/content/ContentTable";
import {
  deleteAdminContent,
  fetchAdminContent,
  fetchAdminContentStats,
  updateAdminContent,
} from "../../../api/adminContentApi";

export default function ContentImagesPage() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    reported: 0,
    deleted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");

  async function loadData() {
    try {
      setLoading(true);

      const [listRes, statsRes] = await Promise.all([
        fetchAdminContent({ type: "image" }),
        fetchAdminContentStats({ type: "image" }),
      ]);

      setItems(listRes.items || []);
      setStats(statsRes.stats || {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(item) {
    const ok = window.confirm(`Delete "${item.title}"?`);
    if (!ok) return;

    try {
      setActionLoadingId(item.id);
      await deleteAdminContent(item.id);
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoadingId("");
    }
  }

  async function handleApprove(item) {
    const nextStatus = item.status === "approved" ? "reported" : "approved";

    try {
      setActionLoadingId(item.id);
      await updateAdminContent(item.id, {
        status: nextStatus,
        flagged: nextStatus === "reported",
        actionLabel:
          nextStatus === "approved"
            ? "Status changed to approved"
            : "Status changed to reported",
      });
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoadingId("");
    }
  }

  async function handleToggleVisibility(item) {
    const nextVisibility = item.visibility === "private" ? "public" : "private";

    try {
      setActionLoadingId(item.id);
      await updateAdminContent(item.id, {
        visibility: nextVisibility,
        actionLabel:
          nextVisibility === "public"
            ? "Asset set to visible"
            : "Asset hidden from public view",
      });
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoadingId("");
    }
  }

  if (loading) {
    return <div className="text-sm text-white">Loading image content...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
              Content Management
            </p>
            <h1
              className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Generated Images
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
              Review image outputs, inspect prompt lineage, and manage content state across the platform.
            </p>
          </div>

          <Link
            to="/admin/content/upload"
            className="rounded-2xl bg-[#53f5e7] px-5 py-3 text-sm font-bold text-black"
          >
            Upload New Asset
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ContentStatCard title="Total Images" value={stats.total || 0} hint="All generated image assets" />
        <ContentStatCard title="Approved" value={stats.approved || 0} hint="Safe visible outputs" />
        <ContentStatCard title="Reported" value={stats.reported || 0} hint="Needs admin review" />
        <ContentStatCard title="Deleted" value={stats.deleted || 0} hint="Removed assets" />
      </section>

      <ContentTable
        data={items}
        onDelete={handleDelete}
        onApprove={handleApprove}
        onToggleVisibility={handleToggleVisibility}
        actionLoadingId={actionLoadingId}
      />
    </div>
  );
}