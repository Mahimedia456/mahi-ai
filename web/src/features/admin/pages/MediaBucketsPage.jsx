import { useEffect, useState } from "react";
import StorageStatCard from "../components/storage/StorageStatCard";
import MediaBucketsTable from "../components/storage/MediaBucketsTable";
import {
  activateMediaBucket,
  deactivateMediaBucket,
  deleteMediaBucket,
  fetchMediaBuckets,
} from "../../../api/adminStorageApi";

export default function MediaBucketsPage() {
  const [items, setItems] = useState([]);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetchMediaBuckets();
      setItems(res.items || []);
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

  async function handleDeactivate(bucket) {
    try {
      setActionLoadingId(bucket.id);
      await deactivateMediaBucket(bucket.id);
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoadingId("");
    }
  }

  async function handleActivate(bucket) {
    try {
      setActionLoadingId(bucket.id);
      await activateMediaBucket(bucket.id);
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoadingId("");
    }
  }

  async function handleDelete(bucket) {
    const ok = window.confirm(`Remove bucket "${bucket.name}"? Bucket must be empty first.`);
    if (!ok) return;

    try {
      setActionLoadingId(bucket.id);
      await deleteMediaBucket(bucket.id);
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoadingId("");
    }
  }

  if (loading) {
    return <div className="text-sm text-white">Loading buckets...</div>;
  }

  const warningBuckets = items.filter((bucket) => bucket.status === "warning").length;

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
          Storage Management
        </p>
        <h1
          className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          Media Buckets
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Review object storage buckets, capacity, lifecycle behavior, and operational health.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <StorageStatCard title="Total Buckets" value={items.length} hint="Configured storage buckets" />
        <StorageStatCard title="Healthy" value={items.filter((b) => b.status === "healthy").length} hint="Operating normally" />
        <StorageStatCard title="Warnings" value={warningBuckets} hint="Needs admin review" />
      </section>

      <MediaBucketsTable
        data={items}
        onDeactivate={handleDeactivate}
        onActivate={handleActivate}
        onDelete={handleDelete}
        actionLoadingId={actionLoadingId}
      />
    </div>
  );
}