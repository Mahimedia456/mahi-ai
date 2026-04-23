import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Clapperboard } from "lucide-react";
import { getVideoStudioJob } from "../../../api/videoStudio.api";
import { getModeLabel } from "../../../utils/videoStudio";

const frames = ["24%", "18%", "12%", "08%"];

export default function VideoStudioGenerating() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;

    async function pollJob() {
      try {
        if (!jobId) {
          setError("Missing job ID.");
          setLoading(false);
          return;
        }

        const response = await getVideoStudioJob(jobId);
        const nextJob = response?.data;

        setJob(nextJob);
        setLoading(false);

        if (nextJob?.status === "completed") {
          navigate(`/app/video-studio/results?jobId=${jobId}`, { replace: true });
          return;
        }

        if (nextJob?.status === "failed") {
          setError(nextJob?.errorMessage || "Video generation failed.");
          return;
        }

        timer = setTimeout(pollJob, 3000);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to fetch job.");
        setLoading(false);
      }
    }

    pollJob();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [jobId, navigate]);

  return (
    <section className="flex h-[calc(100vh-144px)] overflow-hidden">
      <aside className="w-full shrink-0 border-r border-mahi-accent/20 px-8 py-10 md:w-[360px]">
        <div className="space-y-12 opacity-85">
          <div>
            <h1 className="theme-heading text-4xl font-bold uppercase tracking-[-0.05em] text-white">
              Input
            </h1>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent">
              {loading ? "Processing Kernel..." : `Status: ${job?.status || "unknown"}`}
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <label className="mb-4 block border-b border-mahi-outlineVariant/30 pb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                Prompt Vector
              </label>
              <div className="font-mono text-sm leading-8 text-white/50">
                {job?.prompt || job?.motionPrompt || "Waiting for prompt..."}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                  Duration
                </label>
                <div className="theme-heading text-xl font-bold text-white">
                  {job?.durationSeconds ? `${job.durationSeconds}s` : "--"}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                  Aspect
                </label>
                <div className="theme-heading text-xl font-bold text-white">
                  {job?.aspectRatio || "--"}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                  Mode
                </label>
                <div className="theme-heading text-base font-bold text-white">
                  {job?.mode ? getModeLabel(job.mode) : "--"}
                </div>
              </div>
            </div>

            {error ? (
              <div className="rounded border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
                {error}
              </div>
            ) : (
              <button
                type="button"
                className="flex w-full items-center justify-center gap-4 border border-mahi-outlineVariant/40 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-mahi-accent"
              >
                <Loader2 size={16} className="animate-spin" />
                {job?.status === "queued" ? "Queued For Generation" : "Rendering Frames"}
              </button>
            )}
          </div>
        </div>
      </aside>

      <section className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col justify-between gap-6 border-b border-mahi-accent/20 pb-8 md:flex-row md:items-end">
            <div>
              <h2 className="theme-heading text-5xl font-bold uppercase italic tracking-[-0.08em] text-white">
                Output
              </h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-1 w-24 overflow-hidden bg-white/10">
                  <div className="h-full animate-[shimmer_2s_infinite_linear] bg-[linear-gradient(90deg,transparent,#53f5e7,transparent)] bg-[length:200%_100%]" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-mahi-accent">
                  {job?.status === "queued"
                    ? "Queued in render pipeline..."
                    : "Synthesizing visual data..."}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] uppercase tracking-[0.28em] text-white/35">
                Current Job
              </div>
              <div className="theme-heading text-2xl font-bold text-white">
                {jobId ? jobId.slice(0, 8) : "--"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px border border-mahi-accent/20 bg-mahi-accent/10 sm:grid-cols-2">
            {frames.map((item, index) => (
              <div
                key={item}
                className="relative aspect-video bg-black flex flex-col items-center justify-center"
              >
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: "radial-gradient(circle, #53f5e7 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <div className="relative flex flex-col items-center gap-6">
                  <div className="relative flex h-16 w-16 items-center justify-center border border-mahi-accent/20">
                    <div className="absolute inset-0 rounded-full border-t-2 border-mahi-accent animate-spin" />
                    <div className="h-1 w-1 bg-mahi-accent" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-mahi-accent">
                    Sampling // {item}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 text-[8px] font-mono text-white/20">
                  SEC_0{index + 1}_VAL_INIT
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-6 border border-mahi-accent/20 bg-mahi-accent/[0.02] p-8">
            <Clapperboard size={18} className="mt-1 text-mahi-accent" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-mahi-accent">
                Render Note
              </h4>
              <p className="mt-2 font-mono text-[11px] leading-7 text-white/45">
                {job?.status === "queued"
                  ? "// Job is queued and waiting for worker pickup."
                  : "// Motion interpolation is active. Frame coherence and cinematic blur are being resolved before export."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}