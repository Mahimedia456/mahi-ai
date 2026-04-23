import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, TerminalSquare, XCircle } from "lucide-react";
import { useImageStudio } from "../context/ImageStudioContext";
import {
  fetchImageStudioJob,
  cancelImageStudioJob,
} from "../../../api/imageStudio.api";

export default function ImageStudioGenerating() {
  const navigate = useNavigate();
  const { currentJobId, currentJob, setCurrentJob, setCurrentJobId } = useImageStudio();
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!currentJobId) {
      navigate("/app/image-studio");
      return;
    }

    const interval = setInterval(async () => {
      try {
        const job = await fetchImageStudioJob(currentJobId);
        setCurrentJob(job);

        if (job.status === "completed") {
          clearInterval(interval);
          navigate("/app/image-studio/results");
        }

        if (job.status === "failed" || job.status === "cancelled") {
          clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [currentJobId, navigate, setCurrentJob]);

  async function handleCancel() {
    if (!currentJobId) return;

    try {
      setCancelling(true);
      const job = await cancelImageStudioJob(currentJobId);
      setCurrentJob(job);
      setCurrentJobId(null);
      navigate("/app/image-studio");
    } catch (error) {
      console.error(error);
    } finally {
      setCancelling(false);
    }
  }

  if (!currentJob) return null;

  const progress = currentJob.progress || 0;
  const samples = Array.from(
    { length: Number(currentJob.sample_count || 1) },
    (_, i) => i + 1
  );

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col md:flex-row">
      <section className="w-full shrink-0 border-r border-mahi-outlineVariant/30 p-8 md:w-[400px]">
        <div className="space-y-12 opacity-80">
          <div>
            <h1 className="theme-heading text-4xl font-bold uppercase tracking-[-0.05em] text-white">
              Input
            </h1>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent">
              Processing Kernel...
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <label className="mb-4 block border-b border-mahi-outlineVariant/30 pb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                Prompt Vector
              </label>
              <div className="font-mono text-sm leading-8 text-white/50">
                {currentJob.prompt}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                  Aspect
                </label>
                <div className="theme-heading text-x2 font-bold text-white">
                  {currentJob.aspect_ratio}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                  Steps
                </label>
                <div className="theme-heading text-x2 font-bold text-white">
                  {currentJob.steps}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                Progress
              </label>
              <div className="h-2 w-full bg-white/10">
                <div
                  className="h-full bg-mahi-accent transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 text-xs text-white/45">{progress}% complete</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-4 border border-mahi-outlineVariant/40 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-mahi-accent"
            >
              <Loader2 size={16} className="animate-spin" />
              {currentJob.status === "failed"
                ? "Failed"
                : currentJob.status === "cancelled"
                ? "Cancelled"
                : "Executing"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling || currentJob.status === "completed"}
              className="flex w-full items-center justify-center gap-3 border border-red-500/40 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-red-300 transition-all hover:border-red-500 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle size={16} />
              {cancelling ? "Cancelling..." : "Cancel Generation"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid-blueprint flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="flex flex-col justify-between gap-6 border-b border-mahi-outlineVariant/30 pb-8 md:flex-row md:items-end">
            <div>
              <h2 className="theme-heading text-6xl font-extrabold uppercase italic tracking-[-0.08em] text-white">
                Output
              </h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-1 w-24 overflow-hidden bg-white/10">
                  <div className="h-full animate-[shimmer_2s_infinite_linear] bg-[linear-gradient(90deg,transparent,#53f5e7,transparent)] bg-[length:200%_100%]" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-mahi-accent">
                  {currentJob.status === "failed"
                    ? "Generation failed"
                    : currentJob.status === "cancelled"
                    ? "Generation cancelled"
                    : "Synthesizing visual data..."}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] uppercase tracking-[0.28em] text-white/35">
                Estimated Sync
              </div>
              <div className="theme-heading text-4xl font-bold text-white">
                {Math.max(1, Math.ceil((100 - progress) / 8))}.00s
              </div>
            </div>
          </div>

          <div
            className={`grid gap-px border border-mahi-outlineVariant/30 bg-mahi-outlineVariant/20 ${
              samples.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {samples.map((sample) => (
              <div
                key={sample}
                className="relative flex aspect-square flex-col items-center justify-center overflow-hidden bg-black"
              >
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="relative flex flex-col items-center gap-6">
                  <div className="relative flex h-16 w-16 items-center justify-center border border-mahi-accent/20">
                    <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-mahi-accent" />
                    <div className="h-1 w-1 bg-mahi-accent" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-mahi-accent">
                    Sampling // {String(sample).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-6 border border-mahi-accent/20 bg-mahi-accent/[0.02] p-8">
            <TerminalSquare size={18} className="mt-1 text-mahi-accent" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-mahi-accent">
                Architecture Tip
              </h4>
              <p className="mt-2 font-mono text-[11px] leading-7 text-white/45">
                {currentJob.error_message ||
                  "Use saved seed values from completed outputs to recreate nearby compositions."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}