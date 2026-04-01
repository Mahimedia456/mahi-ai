import { useNavigate } from "react-router-dom";
import { Loader2, Clapperboard } from "lucide-react";

const frames = ["24%", "18%", "12%", "08%"];

export default function VideoStudioGenerating() {
  const navigate = useNavigate();

  return (
    <section className="flex h-[calc(100vh-144px)] overflow-hidden">
      <aside className="w-full shrink-0 border-r border-mahi-accent/20 px-8 py-10 md:w-[360px]">
        <div className="space-y-12 opacity-85">
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
                A hyper-realistic cyberpunk street at night, heavy rain reflecting
                neon cyan signs, cinematic anamorphic lens flares, ultra-detailed
                textures, 8k resolution, volumetric fog.
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                  Duration
                </label>
                <div className="theme-heading text-xl font-bold text-white">10.0s</div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                  Aspect
                </label>
                <div className="theme-heading text-xl font-bold text-white">16:9</div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                  Res
                </label>
                <div className="theme-heading text-xl font-bold text-white">U-4K</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/app/video-studio/results")}
              className="flex w-full items-center justify-center gap-4 border border-mahi-outlineVariant/40 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-mahi-accent"
            >
              <Loader2 size={16} className="animate-spin" />
              Rendering Frames
            </button>
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

          <div className="grid grid-cols-1 gap-px border border-mahi-accent/20 bg-mahi-accent/10 sm:grid-cols-2">
            {frames.map((item, index) => (
              <div
                key={item}
                className="relative aspect-video bg-black flex flex-col items-center justify-center"
              >
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #53f5e7 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
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
                // Motion interpolation is active. Frame coherence and cinematic blur are being resolved before export.
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}