import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ContentDetailTabs from "../components/content/ContentDetailTabs";
import {
  deleteAdminContent,
  fetchAdminContentById,
  updateAdminContent,
} from "../../../api/adminContentApi";

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

function PreviewCard({ item }) {
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    setMediaError(false);
  }, [item?.previewUrl, item?.type]);

  const isVideo =
    item?.type === "video" ||
    String(item?.format || "").startsWith("video/") ||
    /\.(mp4|webm|ogg|mov|m4v)$/i.test(item?.previewUrl || "");

  return (
    <div className="rounded-[26px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
      <h3
        className="text-[20px] font-bold tracking-[-0.03em] text-white"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        Asset Preview
      </h3>

      <div className="mt-5 overflow-hidden rounded-3xl border border-white/5 bg-[#111111]">
        {!item?.previewUrl ? (
          <div className="flex h-[420px] items-center justify-center px-6 text-center text-sm text-[#8d9a97]">
            Preview URL not available for this asset.
          </div>
        ) : isVideo ? (
          mediaError ? (
            <div className="flex h-[420px] flex-col items-center justify-center px-6 text-center">
              <p className="text-sm font-semibold text-white">
                This video could not be played in the browser.
              </p>
              <p className="mt-2 max-w-md text-xs leading-6 text-[#8d9a97]">
                Check that the stored video uses a browser-supported codec such as MP4 H.264.
              </p>
              <a
                href={item.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 rounded-xl bg-[#53f5e7]/10 px-4 py-2 text-xs font-semibold text-[#53f5e7]"
              >
                Open Video Directly
              </a>
            </div>
          ) : (
            <video
              key={item.previewUrl}
              controls
              playsInline
              preload="metadata"
              className="h-[420px] w-full bg-black object-contain"
              onError={() => setMediaError(true)}
            >
              <source src={item.previewUrl} type={item.format || "video/mp4"} />
              Your browser does not support video playback.
            </video>
          )
        ) : (
          <img
            src={item.previewUrl}
            alt={item.title}
            className="h-[420px] w-full object-contain"
          />
        )}
      </div>
    </div>
  );
}

export default function ContentDetailsPage() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetchAdminContentById(contentId);
      setItem(res.item);
    } catch (error) {
      console.error(error);
      setItem(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [contentId]);

  async function handleReview() {
    if (!item) return;

    try {
      setActionLoading(true);
      const res = await updateAdminContent(contentId, {
        status: "approved",
        flagged: false,
        actionLabel: "Content reviewed and approved",
        moderationNote: "Reviewed by admin and approved.",
      });
      setItem(res.item);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleToggleVisibility() {
    if (!item) return;

    const nextVisibility = item.visibility === "private" ? "public" : "private";

    try {
      setActionLoading(true);
      const res = await updateAdminContent(contentId, {
        visibility: nextVisibility,
        actionLabel:
          nextVisibility === "public"
            ? "Asset made visible"
            : "Asset hidden from public view",
      });
      setItem(res.item);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleToggleStatus() {
    if (!item) return;

    const nextStatus = item.status === "approved" ? "reported" : "approved";

    try {
      setActionLoading(true);
      const res = await updateAdminContent(contentId, {
        status: nextStatus,
        flagged: nextStatus === "reported",
        actionLabel:
          nextStatus === "approved"
            ? "Status changed to approved"
            : "Status changed to reported",
      });
      setItem(res.item);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!item) return;

    const ok = window.confirm("Are you sure you want to delete this asset?");
    if (!ok) return;

    try {
      setActionLoading(true);
      await deleteAdminContent(contentId);
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-white">Loading content details...</div>;
  }

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
            <button
              disabled={actionLoading}
              onClick={handleToggleVisibility}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {item.visibility === "private" ? "Show Asset" : "Hide Asset"}
            </button>

            <button
              disabled={actionLoading}
              onClick={handleToggleStatus}
              className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-300 disabled:opacity-60"
            >
              Change Status
            </button>

            <button
              disabled={actionLoading}
              onClick={handleDelete}
              className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 disabled:opacity-60"
            >
              Delete Asset
            </button>

            <button
              disabled={actionLoading}
              onClick={handleReview}
              className="rounded-2xl bg-[#53f5e7] px-5 py-3 text-sm font-bold text-black disabled:opacity-60"
            >
              Review Moderation
            </button>
          </div>
        </div>
      </section>

      <PreviewCard item={item} />

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
            <p className="text-sm leading-7 text-[#d2dbd9]">{item.moderationNote || "-"}</p>
          </Panel>
        </div>
      )}

      {activeTab === "activity" && (
        <Panel title="Asset Activity" subtitle="Timeline for this content item.">
          <div className="space-y-3">
            {(item.activity || []).map((entry) => (
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