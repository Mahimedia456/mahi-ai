import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContentDetailTabs from "../components/content/ContentDetailTabs";
import { contentItems } from "../data/contentData";

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

export default function ContentDetailsPage() {
  const { contentId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const item = useMemo(() => contentItems.find((entry) => entry.id === contentId), [contentId]);

  if (!item) {
    return (
      <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        Content item not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link to="/admin/content/images" className="text-xs font-semibold text-[#53f5e7]">
              ← Back to content
            </Link>
            <h1
              className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              {item.title}
            </h1>
            <p className="mt-2 text-sm text-[#9eaaa7]">
              {item.type} · {item.status} · {item.userName}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white">
              Delete Asset
            </button>
            <button className="rounded-2xl bg-[#53f5e7] px-5 py-3 text-sm font-bold text-black">
              Review Moderation
            </button>
          </div>
        </div>
      </section>

      <ContentDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Content Overview" subtitle="Primary asset and ownership metadata.">
            <DataRow label="Title" value={item.title} />
            <DataRow label="Type" value={item.type} />
            <DataRow label="User" value={item.userName} />
            <DataRow label="Email" value={item.userEmail} />
            <DataRow label="Created At" value={item.createdAt} />
            <DataRow label="Visibility" value={item.visibility} />
            <DataRow label="Status" value={item.status} />
          </Panel>

          <Panel title="Asset Summary" subtitle="Rendering and storage information.">
            <DataRow label="Model" value={item.model} />
            <DataRow label="Resolution" value={item.resolution} />
            <DataRow label="Format" value={item.format} />
            <DataRow label="File Size" value={item.size} />
          </Panel>
        </div>
      )}

      {activeTab === "prompt" && (
        <Panel title="Prompt" subtitle="Prompt used to generate this asset.">
          <div className="rounded-2xl border border-white/5 bg-[#151515] p-5 text-sm leading-7 text-[#d2dbd9]">
            {item.prompt}
          </div>
        </Panel>
      )}

      {activeTab === "metadata" && (
        <Panel title="Metadata" subtitle="Technical metadata attached to this asset.">
          <DataRow label="Model" value={item.model} />
          <DataRow label="Resolution" value={item.resolution} />
          <DataRow label="Format" value={item.format} />
          <DataRow label="Size" value={item.size} />
          <DataRow label="Visibility" value={item.visibility} />
          <DataRow label="Flagged" value={item.flagged ? "Yes" : "No"} />
        </Panel>
      )}

      {activeTab === "moderation" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Panel title="Moderation State" subtitle="Current policy and admin review state.">
            <DataRow label="Status" value={item.status} />
            <DataRow label="Flagged" value={item.flagged ? "Yes" : "No"} />
            <DataRow label="Visibility" value={item.visibility} />
          </Panel>

          <Panel title="Moderation Notes" subtitle="Internal moderation notes.">
            <p className="text-sm leading-7 text-[#d2dbd9]">{item.moderationNote}</p>
          </Panel>
        </div>
      )}

      {activeTab === "activity" && (
        <Panel title="Asset Activity" subtitle="Timeline for this content item.">
          <div className="space-y-3">
            {item.activity.map((entry) => (
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