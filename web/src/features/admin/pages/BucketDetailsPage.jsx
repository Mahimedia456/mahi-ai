import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BucketDetailTabs from "../components/storage/BucketDetailTabs";
import { mediaBuckets } from "../data/storageData";

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
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

export default function BucketDetailsPage() {
  const { bucketId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const bucket = useMemo(() => mediaBuckets.find((item) => item.id === bucketId), [bucketId]);

  if (!bucket) {
    return (
      <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        Bucket not found.
      </div>
    );
  }

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
              {bucket.region} · {bucket.visibility} · {bucket.status}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white">
              Archive Files
            </button>
            <button className="rounded-2xl bg-[#53f5e7] px-5 py-3 text-sm font-bold text-black">
              Update Policy
            </button>
          </div>
        </div>
      </section>

      <BucketDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Bucket Overview" subtitle="Core storage bucket metadata.">
            <DataRow label="Bucket Name" value={bucket.name} />
            <DataRow label="Region" value={bucket.region} />
            <DataRow label="Visibility" value={bucket.visibility} />
            <DataRow label="Status" value={bucket.status} />
            <DataRow label="Total Size" value={bucket.totalSize} />
            <DataRow label="File Count" value={bucket.fileCount} />
          </Panel>

          <Panel title="Bucket Summary" subtitle="Primary operational summary.">
            <p className="text-sm leading-7 text-[#d2dbd9]">{bucket.description}</p>
          </Panel>
        </div>
      )}

      {activeTab === "files" && (
        <Panel title="Recent Files" subtitle="Latest objects stored in this bucket.">
          <div className="space-y-3">
            {bucket.files.map((file) => (
              <div
                key={file.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#151515] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{file.name}</p>
                  <p className="mt-1 text-xs text-[#92a09d]">
                    {file.type} · {file.size} · {file.uploadedAt}
                  </p>
                </div>

                <button className="rounded-xl bg-[#53f5e7]/10 px-4 py-2 text-xs font-semibold text-[#53f5e7]">
                  Inspect File
                </button>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {activeTab === "policies" && (
        <Panel title="Bucket Policies" subtitle="Storage rules and access behavior.">
          <div className="space-y-3">
            {bucket.policies.map((policy, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/5 bg-[#151515] p-4 text-sm text-[#d1dad8]"
              >
                {policy}
              </div>
            ))}
          </div>
        </Panel>
      )}

      {activeTab === "activity" && (
        <Panel title="Bucket Activity" subtitle="Recent operational events for this bucket.">
          <div className="space-y-3">
            {bucket.activity.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#151515] p-4 md:flex-row md:items-center md:justify-between"
              >
                <p className="text-sm text-white">{entry.text}</p>
                <span className="text-xs text-[#8f9d99]">{entry.time}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}