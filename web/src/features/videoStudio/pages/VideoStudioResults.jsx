import { Download, Save, RotateCcw, Wand2, FolderOpen } from "lucide-react";

const archiveFrames = [
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
];

export default function VideoStudioResults() {
  return (
    <section className="flex min-h-[calc(100vh-144px)] flex-col gap-10 p-8 xl:flex-row">
      <div className="min-w-0 flex-1 space-y-10">
        <div className="overflow-hidden border border-mahi-accent/30">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80"
            alt="Video preview"
            className="aspect-video w-full object-cover"
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/35">
              Archive_History
            </h3>
            <button className="text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent">
              Browse All
            </button>
          </div>

          <div className="flex gap-6 overflow-hidden">
            {archiveFrames.map((src, index) => (
              <div
                key={src}
                className={`h-28 w-48 shrink-0 overflow-hidden border ${
                  index === 0 ? "border-mahi-accent" : "border-mahi-outlineVariant/20"
                }`}
              >
                <img
                  src={src}
                  alt={`Archive ${index + 1}`}
                  className="h-full w-full object-cover grayscale"
                />
              </div>
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
              "A CYBERNETIC STREET AT NIGHT, HEAVY RAIN REFLECTING NEON CYAN
              SIGNS, CINEMATIC ANAMORPHIC LENS FLARES, ULTRA-DETAILED TEXTURES,
              8K RESOLUTION, VOLUMETRIC FOG."
            </p>
          </div>

          <div className="mb-8 grid grid-cols-3 gap-px border border-mahi-accent/20 bg-mahi-accent/10">
            {[
              { label: "DUR", value: "10.0S" },
              { label: "ASPECT", value: "16:9" },
              { label: "RES", value: "U-4K" },
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

          <div className="space-y-4">
            <button className="flex w-full items-center justify-center gap-3 bg-mahi-accent px-6 py-5 text-[10px] font-bold uppercase tracking-[0.28em] text-black">
              <Download size={15} />
              Execute_Download
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 border border-mahi-accent/30 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent">
                <FolderOpen size={14} />
                Save
              </button>
              <button className="flex items-center justify-center gap-2 border border-mahi-accent/30 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent">
                <Wand2 size={14} />
                V_Opt
              </button>
            </div>

            <button className="flex w-full items-center justify-center gap-3 border border-mahi-outlineVariant/25 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
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
              v.3.5_PRO
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center border border-mahi-accent/30 text-mahi-accent">
              ✦
            </div>
            <div>
              <div className="theme-heading text-lg font-bold text-white">
                MAHI-DIFFUSION_ULTRA
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/30">
                CINEMATIC REALISM OPTIMIZED
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}