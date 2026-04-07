import { useEffect, useState } from "react";
import ContentStatCard from "../components/content/ContentStatCard";
import ContentTable from "../components/content/ContentTable";
import {
  deleteAdminContent,
  fetchAdminContent,
  fetchAdminContentStats,
  updateAdminContent,
} from "../../../api/adminContentApi";

export default function ReportedContentPage() {
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
        fetchAdminContent({ status: "reported" }),
        fetchAdminContentStats(),
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
    try {
      setActionLoadingId(item.id);
      await updateAdminContent(item.id, {
        status: "approved",
        flagged: false,
        actionLabel: "Reported content reviewed and approved",
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
            ? "Reported asset made visible"
            : "Reported asset hidden from public view",
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
    return <div className="text-sm text-white">Loading reported content...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
          Content Management
        </p>
        <h1
          className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          Reported Content
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Review assets that entered moderation flow, investigate prompts, and take administrative action.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <ContentStatCard title="Reported Items" value={items.length} hint="Flagged for admin review" />
        <ContentStatCard title="Manual Review" value={items.length} hint="Pending moderation pass" />
        <ContentStatCard title="Approved Total" value={stats.approved || 0} hint="Platform approved assets" />
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