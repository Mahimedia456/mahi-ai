import { Search, Bell, Download, Share2, Plus, X } from "lucide-react";

const mediaItems = [
  {
    id: "IMG_01",
    name: "Obsidian Flux",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "VID_01",
    name: "Neural Latency",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "IMG_02",
    name: "Global Mesh",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "IMG_03",
    name: "Brutalist Echo",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
  },
];

export default function MediaLibraryPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-black">
      <header className="sticky top-16 z-20 flex items-center justify-between border-b border-mahi-accent/20 bg-black px-10 py-4">
        <div className="flex items-center space-x-10">
          <h2 className="theme-heading text-3xl font-bold uppercase tracking-[0.18em] text-white">
            Asset Repository
          </h2>

          <nav className="flex space-x-8">
            <button className="h-16 border-b border-mahi-accent px-1 text-[9px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              All_Assets
            </button>
            <button className="h-16 px-1 text-[9px] font-medium uppercase tracking-[0.2em] text-white/35 transition-all hover:text-white">
              Images
            </button>
            <button className="h-16 px-1 text-[9px] font-medium uppercase tracking-[0.2em] text-white/35 transition-all hover:text-white">
              Videos
            </button>
            <button className="h-16 px-1 text-[9px] font-medium uppercase tracking-[0.2em] text-white/35 transition-all hover:text-white">
              Starred
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-8">
          <div className="relative flex items-center border-b border-mahi-accent/20 py-1">
            <Search size={14} className="mr-2 text-mahi-accent" />
            <input
              type="text"
              placeholder="Search_Registry..."
              className="w-40 border-none bg-transparent text-[10px] uppercase tracking-[0.14em] text-white placeholder:text-white/20 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-white/35 transition-all hover:text-mahi-accent">
              <Bell size={18} />
            </button>
            <div className="h-6 w-6 border border-mahi-accent p-0.5">
              <div className="h-full w-full bg-white/20" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex space-x-10 px-10 pb-12 pt-24">
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/5] overflow-hidden border border-mahi-accent/20 transition-all duration-300 hover:border-mahi-accent"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-100"
                />

                <div className="absolute left-0 top-0 p-2">
                  <span className="border border-mahi-accent/40 bg-black/80 px-1 text-[8px] font-bold tracking-widest text-mahi-accent">
                    {item.id}
                  </span>
                </div>

                <div className="glass-overlay absolute inset-0 flex flex-col justify-end border-t border-mahi-accent/30 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="theme-heading mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    {item.name}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-px">
                    <button className="border border-mahi-accent/50 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-mahi-accent transition-colors hover:bg-mahi-accent hover:text-black">
                      Inspect
                    </button>
                    <button className="border border-mahi-accent/50 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-mahi-accent transition-colors hover:bg-mahi-accent hover:text-black">
                      Fork
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="sticky top-24 flex h-[calc(100vh-120px)] w-80 flex-col border border-mahi-accent/20 bg-black p-6">
          <div className="mb-8 flex items-center justify-between border-b border-mahi-accent/20 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-mahi-accent">
              Metadata_Viewer
            </h3>
            <button className="text-white/35 transition-colors hover:text-mahi-accent">
              <X size={16} />
            </button>
          </div>

          <div className="group relative mb-8 border border-mahi-accent/20">
            <img
              src={mediaItems[0].image}
              alt="preview"
              className="h-40 w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
            />
            <div className="absolute bottom-0 right-0 border-l border-t border-mahi-accent/20 bg-black p-1">
              <span className="px-1 text-[8px] font-bold uppercase tracking-[0.18em] text-mahi-accent">
                Live_Preview
              </span>
            </div>
          </div>

          <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto pr-2">
            <div>
              <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.3em] text-mahi-accent/60">
                Registry_ID
              </p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-white">
                OBSIDIAN_FLUX_V1_HQ
              </p>
            </div>

            <div>
              <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.3em] text-mahi-accent/60">
                Neural_Model
              </p>
              <p className="theme-heading text-[11px] uppercase tracking-[0.16em] text-white">
                Synthetic Noir XL v2
              </p>
            </div>

            <div>
              <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.3em] text-mahi-accent/60">
                Input_Vector
              </p>
              <div className="border border-mahi-accent/20 bg-mahi-accent/5 p-4">
                <p className="font-mono text-[10px] uppercase leading-6 text-white/55">
                  "Cinematic obsidian ribbons, fluid motion, high contrast lighting,
                  cyan neon glowing edges..."
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.3em] text-mahi-accent/60">
                  Resolution
                </p>
                <p className="font-mono text-[10px] text-white">3840x5120</p>
              </div>
              <div>
                <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.3em] text-mahi-accent/60">
                  Entropy_Seed
                </p>
                <p className="font-mono text-[10px] text-white">882947102</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2 border-t border-mahi-accent/20 pt-8">
            <button className="flex w-full items-center justify-center space-x-2 bg-mahi-accent py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:scale-[1.02]">
              <Download size={14} />
              <span>Download_Asset</span>
            </button>

            <button className="flex w-full items-center justify-center space-x-2 border border-mahi-accent/20 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:border-mahi-accent hover:text-mahi-accent">
              <Share2 size={14} />
              <span>Deploy_Node</span>
            </button>
          </div>
        </aside>
      </div>

      <button className="fixed bottom-10 right-10 z-50 flex h-12 w-12 items-center justify-center border border-mahi-accent bg-black text-mahi-accent transition-all duration-300 hover:bg-mahi-accent hover:text-black">
        <Plus size={22} />
      </button>
    </div>
  );
}