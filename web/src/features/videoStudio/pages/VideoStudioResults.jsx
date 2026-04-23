import { useEffect, useState } from "react";
import { Download, Save, RotateCcw, Wand2, FolderOpen } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getVideoStudioJob,
  getVideoStudioJobs,
  saveVideoStudioAsset,
} from "../../../api/videoStudio.api";

export default function VideoStudioResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [jobRes, historyRes] = await Promise.all([
          getVideoStudioJob(jobId),
          getVideoStudioJobs({ page: 1, limit: 6 }),
        ]);

        setJob(jobRes?.data || null);
        setHistoryItems(historyRes?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to load result.");
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      loadData();
    } else {
      setError("Missing job ID.");
      setLoading(false);
    }
  }, [jobId]);

  async function handleSaveToLibrary() {
    try {
      if (!job?.outputVideoPath) return;

      setSaving(true);
      await saveVideoStudioAsset({
        jobId: job.id,
        assetType: "output_video",
        title: job.title || "Saved video",
        storagePath: job.outputVideoPath,
        publicUrl: job.outputVideoUrl,
        mimeType: "video/mp4",
        fileSizeBytes: job.fileSizeBytes,
        durationMs: job.durationMs,
        fps: job.fps,
        isLibraryItem: true,
        tags: [job.mode, job.style].filter(Boolean),
        meta: {
          source: "video_studio_results_save",
        },
      });

      alert("Saved to library successfully.");
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Failed to save to library.");
    } finally {
      setSaving(false);
    }
  }

  function handleDownload() {
    if (!job?.outputVideoUrl) {
      alert("Output video URL is not available yet.");
      return;
    }

    window.open(job.outputVideoUrl, "_blank");
  }

  function handleRegenerate() {
    navigate("/app/video-studio");
  }

  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-144px)] items-center justify-center p-8 text-white/60">
        Loading result...
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-144px)] flex-col gap-10 p-8 xl:flex-row">
      <div className="min-w-0 flex-1 space-y-10">
        <div className="overflow-hidden border border-mahi-accent/30">
          {job?.outputVideoUrl ? (
            <video
              src={job.outputVideoUrl}
              controls
              className="aspect-video w-full bg-black object-cover"
            />
          ) : job?.previewImageUrl || job?.thumbnailUrl ? (
            <img
              src={job.previewImageUrl || job.thumbnailUrl}
              alt="Video preview"
              className="aspect-video w-full object-cover"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-black text-white/35">
              No preview available yet
            </div>
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/35">
              Archive_History
            </h3>
            <button
              onClick={() => navigate("/app/video-studio/history")}
              className="text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent"
            >
              Browse All
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto">
            {historyItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/app/video-studio/results?jobId=${item.id}`)}
                className={`h-28 w-48 shrink-0 overflow-hidden border text-left ${
                  item.id === job?.id ? "border-mahi-accent" : "border-mahi-outlineVariant/20"
                }`}
              >
                {item.thumbnailUrl || item.previewImageUrl ? (
                  <img
                    src={item.thumbnailUrl || item.previewImageUrl}
                    alt={item.title || "History preview"}
                    className="h-full w-full object-cover grayscale"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-black text-xs text-white/30">
                    {item.title || "Video"}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="w-full shrink-0 space-y-6 xl:w-[320px]">
        <div className="border border-mahi-accent/20 p-8">
          <div className="mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.28em] text-mahi-accent">
              Input_Prompt
            </h4>
            <p className="mt-6 text-sm italic leading-9 text-white/88">
              "{job?.prompt || job?.motionPrompt || "No prompt available"}"
            </p>
          </div>

          <div className="mb-8 grid grid-cols-3 gap-px border border-mahi-accent/20 bg-mahi-accent/10">
            {[
              { label: "DUR", value: job?.durationSeconds ? `${job.durationSeconds}S` : "--" },
              { label: "ASPECT", value: job?.aspectRatio || "--" },
              { label: "FPS", value: job?.fps || "--" },
            ].map((item) => (
              <div key={item.label} className="bg-black px-4 py-4 text-center">
                <div className="text-[8px] uppercase tracking-[0.24em] text-white/28">
                  {item.label}
                </div>
                <div className="mt-3 theme-heading text-1xl font-bold text-white">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}

          <div className="space-y-4">
            <button
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-3 bg-mahi-accent px-6 py-5 text-[10px] font-bold uppercase tracking-[0.28em] text-black"
            >
              <Download size={15} />
              Execute_Download
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleSaveToLibrary}
                disabled={saving}
                className="flex items-center justify-center gap-2 border border-mahi-accent/30 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent disabled:opacity-50"
              >
                <FolderOpen size={14} />
                {saving ? "Saving" : "Save"}
              </button>

              <button
                onClick={() => navigate("/app/video-studio/library")}
                className="flex items-center justify-center gap-2 border border-mahi-accent/30 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent"
              >
                <Wand2 size={14} />
                Library
              </button>
            </div>

            <button
              onClick={handleRegenerate}
              className="flex w-full items-center justify-center gap-3 border border-mahi-outlineVariant/25 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30"
            >
              <RotateCcw size={14} />
              Re_Generate
            </button>
          </div>
        </div>

        <div className="border border-mahi-accent/20 p-8">
          <div className="mb-5 flex items-center justify-between">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
              Engine_Core
            </h4>
            <div className="border border-mahi-accent px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              {job?.modelKey || "LOCAL_STUB"}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center border border-mahi-accent/30 text-mahi-accent">
              ✦
            </div>
            <div>
              <div className="theme-heading text-lg font-bold text-white">
                {job?.style || "DEFAULT_VIDEO_ENGINE"}
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/30">
                {job?.mode === "frame_to_video"
                  ? "FRAME ANIMATION PIPELINE"
                  : "TEXT TO VIDEO PIPELINE"}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}