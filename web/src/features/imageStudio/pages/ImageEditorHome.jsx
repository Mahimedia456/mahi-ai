import { Link2, ImagePlus, HelpCircle } from "lucide-react";

const actions = [
  {
    title: "Masking",
    desc: "Neural isolation of subjects with high-fidelity perimeter detection.",
  },
  {
    title: "Injection",
    desc: "Contextual object synthesis via direct text-to-tensor injection.",
  },
  {
    title: "Style Map",
    desc: "Remapping color and texture distributions via latent style transfer.",
  },
  {
    title: "Environment",
    desc: "Total background reconstruction using generative procedural seeds.",
  },
  {
    title: "Resolution",
    desc: "Super-resolution upscaling and neural de-noising algorithms.",
  },
];

export default function ImageEditorHome() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-black">
      <div className="pointer-events-none absolute right-[-5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-mahi-accent/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-mahi-accent/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-8 py-12">
        <div className="mb-16 space-y-4">
          <div className="mb-6 flex items-center gap-2 text-mahi-accent">
            <span className="h-2 w-2 animate-pulse rounded-full bg-mahi-accent" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Module: Image Transformation
            </span>
          </div>

          <h1 className="theme-heading max-w-2xl text-2xl font-bold uppercase tracking-[-0.03em] text-white md:text-4xl">
            Pixel <span className="italic text-mahi-accent">Synthesis</span>
          </h1>

          <p className="max-w-2xl border-l border-mahi-accent/20 pl-3 text- leading-relaxed text-white/35">
            Directing neural networks through high-contrast interfaces. Upload to begin manipulation.
          </p>
        </div>

        <div className="mb-24">
          <div className="group relative cursor-pointer overflow-hidden border border-mahi-accent/20 p-20 transition-all duration-700 hover:border-mahi-accent/60">
            <div className="absolute inset-0 bg-mahi-accent/[0.01] transition-colors group-hover:bg-mahi-accent/[0.03]" />

            <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-mahi-accent/40 group-hover:border-mahi-accent" />
            <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-mahi-accent/40 group-hover:border-mahi-accent" />
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-mahi-accent/40 group-hover:border-mahi-accent" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-mahi-accent/40 group-hover:border-mahi-accent" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-10 flex h-24 w-24 items-center justify-center border border-mahi-accent/20 transition-all duration-500 group-hover:border-mahi-accent">
                <ImagePlus size={48} className="text-mahi-accent" />
              </div>

              <h3 className="theme-heading text-3xl font-bold uppercase tracking-[0.2em] text-white">
                Input Source
              </h3>
              <p className="mb-12 mt-4 text-xs uppercase tracking-[0.24em] text-white/25">
                DRAG DATA OR BROWSE (RAW / PNG / JPG)
              </p>

              <div className="flex items-center gap-6">
                <button className="bg-mahi-accent px-12 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-white">
                  Browse Files
                </button>

                <div className="flex gap-4">
                  <button className="border border-mahi-accent/20 p-4 text-white transition-all hover:border-mahi-accent hover:text-mahi-accent">
                    <Link2 size={18} />
                  </button>
                  <button className="border border-mahi-accent/20 p-4 text-white transition-all hover:border-mahi-accent hover:text-mahi-accent">
                    <ImagePlus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 border-l border-t border-mahi-accent/10 md:grid-cols-6">
          <div className="col-span-full px-4 py-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-mahi-accent/60">
              // Operation Presets
            </h2>
          </div>

          {actions.slice(0, 3).map((item) => (
            <div
              key={item.title}
              className="border-b border-r border-mahi-accent/10 p-8 transition-all hover:bg-mahi-accent/[0.02] md:col-span-2"
            >
              <div className="mb-8 flex h-12 w-12 items-center justify-center border border-mahi-accent/20 text-mahi-accent">
                ✦
              </div>
              <h4 className="theme-heading text-lg font-bold uppercase tracking-[0.12em] text-white">
                {item.title}
              </h4>
              <p className="mt-3 text-sm leading-7 text-white/35">{item.desc}</p>
            </div>
          ))}

          {actions.slice(3).map((item) => (
            <div
              key={item.title}
              className="border-b border-r border-mahi-accent/10 p-10 transition-all hover:bg-mahi-accent/[0.02] md:col-span-3"
            >
              <div className="flex items-center gap-8">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-mahi-accent/20 text-mahi-accent">
                  ✦
                </div>
                <div>
                  <h4 className="theme-heading text-xl font-bold uppercase tracking-[0.14em] text-white">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-white/35">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 flex flex-col items-center justify-between gap-8 border-t border-mahi-accent/10 pt-12 text-[10px] uppercase tracking-[0.3em] text-white/20 md:flex-row">
          <div className="flex gap-12">
            <span className="transition-colors hover:text-mahi-accent">Privacy_Protocols</span>
            <span className="transition-colors hover:text-mahi-accent">Usage_Terms</span>
          </div>

          <div className="flex items-center gap-3 border border-mahi-accent/30 px-4 py-2">
            <span className="h-1.5 w-1.5 animate-pulse bg-mahi-accent" />
            <span className="font-bold text-mahi-accent">Network Online</span>
          </div>

          <div>© 2024 MAHI_AI.CORP // GLOBAL_NODE_01</div>
        </div>
      </div>

      <button className="fixed bottom-10 right-10 z-50 flex h-16 w-16 items-center justify-center border border-mahi-accent/40 bg-black text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black">
        <HelpCircle size={22} />
      </button>
    </div>
  );
}