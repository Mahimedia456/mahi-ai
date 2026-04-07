import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BucketDetailTabs from "../components/storage/BucketDetailTabs";
import {
  activateMediaBucket,
  deactivateMediaBucket,
  fetchMediaBucketDetail,
} from "../../../api/adminStorageApi";

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

export default function MediaBucketDetailPage() {
  const { bucketId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function loadData() {
    try {
      const res = await fetchMediaBucketDetail(bucketId);
      setData(res);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [bucketId]);

  async function handleToggleActive() {
    if (!data?.bucket) return;

    try {
      setActionLoading(true);

      if (data.bucket.isActive) {
        await deactivateMediaBucket(bucketId);
      } else {
        await activateMediaBucket(bucketId);
      }

      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (!data?.bucket) {
    return <div className="text-sm text-white">Loading bucket details...</div>;
  }

  const { bucket, files, policies, activity } = data;

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link to="/admin/storage/buckets" className="text-xs font-semibold text-[#53f5e7]">
              ← Back to buckets
            </Link>
            <h1
              className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              {bucket.name}
            </h1>
            <p className="mt-2 text-sm text-[#9eaaa7]">
              {bucket.visibility} · {bucket.status} · {bucket.totalSize}
            </p>
          </div>

          <button
            disabled={actionLoading}
            onClick={handleToggleActive}
            className="rounded-2xl bg-[#53f5e7] px-5 py-3 text-sm font-bold text-black disabled:opacity-60"
          >
            {bucket.isActive ? "Deactivate Bucket" : "Activate Bucket"}
          </button>
        </div>
      </section>

      <BucketDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Bucket Overview" subtitle="Capacity and configuration details.">
            <DataRow label="Bucket Name" value={bucket.name} />
            <DataRow label="Bucket ID" value={bucket.bucketId} />
            <DataRow label="Region" value={bucket.region} />
            <DataRow label="Visibility" value={bucket.visibility} />
            <DataRow label="Status" value={bucket.status} />
            <DataRow label="Active" value={bucket.isActive ? "Yes" : "No"} />
          </Panel>

          <Panel title="Usage Summary" subtitle="Current object storage totals.">
            <DataRow label="Total Size" value={bucket.totalSize} />
            <DataRow label="Files" value={bucket.fileCount} />
            <DataRow label="Description" value={bucket.description} />
          </Panel>
        </div>
      )}

      {activeTab === "files" && (
        <Panel title="Files" subtitle="Objects currently stored in this bucket.">
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#151515] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{file.name}</p>
                  <p className="mt-1 text-xs text-[#8f9d99]">{file.mimeType}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{file.size}</p>
                  <p className="mt-1 text-xs text-[#8f9d99]">{file.updatedAt}</p>
                </div>
              </div>
            ))}

            {!files.length && (
              <div className="rounded-2xl border border-white/5 bg-[#151515] p-4 text-sm text-[#8f9d99]">
                No files found in this bucket.
              </div>
            )}
          </div>
        </Panel>
      )}

      {activeTab === "policies" && (
        <Panel title="Policies" subtitle="Lifecycle and bucket settings.">
          <DataRow label="Visibility" value={policies.visibility} />
          <DataRow label="Active State" value={policies.activeState} />
          <DataRow label="Notes" value={policies.notes} />
        </Panel>
      )}

      {activeTab === "activity" && (
        <Panel title="Activity" subtitle="Recent admin actions on this bucket.">
          <div className="space-y-3">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#151515] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm text-white">{item.action}</p>
                  <p className="mt-1 text-xs text-[#8f9d99]">{item.actorName}</p>
                </div>
                <span className="text-xs text-[#8f9d99]">{item.createdAt}</span>
              </div>
            ))}

            {!activity.length && (
              <div className="rounded-2xl border border-white/5 bg-[#151515] p-4 text-sm text-[#8f9d99]">
                No activity found for this bucket.
              </div>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}