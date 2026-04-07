import { useEffect, useMemo, useState } from "react";
import StorageStatCard from "../components/storage/StorageStatCard";
import UserStorageTable from "../components/storage/UserStorageTable";
import { fetchStorageSummary, fetchUserStorageUsage } from "../../../api/adminStorageApi";

export default function StorageUsagePage() {
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);

      const [summaryRes, usersRes] = await Promise.all([
        fetchStorageSummary(),
        fetchUserStorageUsage(),
      ]);

      setSummary(summaryRes.summary || null);
      setUsers(usersRes.items || []);
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

  const distribution = useMemo(() => {
    const total = Number(summary?.totalUsedBytes || 0);
    if (!total) {
      return {
        images: 0,
        videos: 0,
        archived: 0,
      };
    }

    return {
      images: Math.max(2, Math.round((Number(summary?.imageBytes || 0) / total) * 100)),
      videos: Math.max(2, Math.round((Number(summary?.videoBytes || 0) / total) * 100)),
      archived: Math.max(2, Math.round((Number(summary?.archivedBytes || 0) / total) * 100)),
    };
  }, [summary]);

  if (loading || !summary) {
    return <div className="text-sm text-white">Loading storage usage...</div>;
  }

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
          Storage Usage
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Monitor platform storage consumption, distribution by media type, and high-usage accounts.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StorageStatCard
          title="Total Used"
          value={summary.totalUsed}
          hint={`of ${summary.totalCapacity} total capacity`}
        />
        <StorageStatCard
          title="Utilization"
          value={`${summary.utilization}%`}
          hint={`Monthly growth ${summary.monthlyGrowth}`}
        />
        <StorageStatCard
          title="Images"
          value={summary.imageStorage}
          hint="Generated image assets"
        />
        <StorageStatCard
          title="Videos"
          value={summary.videoStorage}
          hint="Rendered video outputs"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
          <h3
            className="text-[20px] font-bold tracking-[-0.03em] text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Capacity Distribution
          </h3>
          <p className="mt-2 text-sm text-[#93a19e]">
            Current storage distribution by content category.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#a2afac]">Images</span>
                <span className="text-white">{summary.imageStorage}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#252525]">
                <div className="h-full rounded-full bg-[#53f5e7]" style={{ width: `${distribution.images}%` }} />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#a2afac]">Videos</span>
                <span className="text-white">{summary.videoStorage}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#252525]">
                <div className="h-full rounded-full bg-[#53f5e7]" style={{ width: `${distribution.videos}%` }} />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#a2afac]">Archived Media</span>
                <span className="text-white">{summary.archivedStorage}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#252525]">
                <div className="h-full rounded-full bg-[#53f5e7]" style={{ width: `${distribution.archived}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
          <h3
            className="text-[20px] font-bold tracking-[-0.03em] text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Storage Snapshot
          </h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/5 bg-[#151515] p-4">
              <p className="text-sm text-[#98a5a2]">Active Buckets</p>
              <p className="mt-2 text-2xl font-bold text-white">{summary.activeBuckets}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#151515] p-4">
              <p className="text-sm text-[#98a5a2]">Archived Storage</p>
              <p className="mt-2 text-2xl font-bold text-white">{summary.archivedStorage}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#151515] p-4">
              <p className="text-sm text-[#98a5a2]">Growth Rate</p>
              <p className="mt-2 text-2xl font-bold text-white">{summary.monthlyGrowth}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h3
            className="text-[22px] font-bold tracking-[-0.03em] text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            User Storage
          </h3>
          <p className="mt-2 text-sm text-[#93a19e]">
            Highest storage consumers across user accounts.
          </p>
        </div>

        <UserStorageTable data={users} />
      </section>
    </div>
  );
}