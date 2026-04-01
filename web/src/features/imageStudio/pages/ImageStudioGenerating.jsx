import { useNavigate } from "react-router-dom";
import { Loader2, TerminalSquare } from "lucide-react";

const samples = [
  "24%",
  "18%",
  "12%",
  "08%",
];

export default function ImageStudioGenerating() {
  const navigate = useNavigate();

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
                A hyper-realistic cyberpunk street at night, neon reflections in puddles, cinematic lighting, 8k resolution, volumetric fog, intricate details.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                  Aspect
                </label>
                <div className="theme-heading text-x2 font-bold text-white">16:9</div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                  Steps
                </label>
                <div className="theme-heading text-x2 font-bold text-white">50</div>
              </div>
            </div>

            <div>
              <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                System Matrix
              </label>
              <div className="space-y-3">
                <div className="h-px bg-mahi-outlineVariant/30" />
                <div className="h-px bg-mahi-outlineVariant/30" />
                <div className="h-px bg-mahi-outlineVariant/30" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/app/image-studio/results")}
            className="flex w-full items-center justify-center gap-4 border border-mahi-outlineVariant/40 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-mahi-accent"
          >
            <Loader2 size={16} className="animate-spin" />
            Executing
          </button>
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
                  Synthesizing visual data...
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] uppercase tracking-[0.28em] text-white/35">
                Estimated Sync
              </div>
              <div className="theme-heading text-4xl font-bold text-white">14.00s</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px border border-mahi-outlineVariant/30 bg-mahi-outlineVariant/20 sm:grid-cols-2">
            {samples.map((sample, index) => (
              <div
                key={sample}
                className="relative aspect-square bg-black flex flex-col items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="relative flex flex-col items-center gap-6">
                  <div className="relative flex h-16 w-16 items-center justify-center border border-mahi-accent/20">
                    <div className="absolute inset-0 rounded-full border-t-2 border-mahi-accent animate-spin" />
                    <div className="h-1 w-1 bg-mahi-accent" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-mahi-accent">
                    Sampling // {sample}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-[8px] font-mono text-white/20">
                  SEC_0{index + 1}_VAL_INIT
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
                // Use the "Seed" parameter in History to recreate similar styles or "Weight" to emphasize specific words in your prompt.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}