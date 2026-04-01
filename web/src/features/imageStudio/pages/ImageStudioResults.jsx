import { Download, Trash2, ArrowUpCircle, FolderPlus, Filter } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
];

export default function ImageStudioResults() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-black p-8">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
            Results
          </h1>
          <div className="mt-4 flex items-center gap-3 border-b border-mahi-outlineVariant/30 py-2">
            <span className="text-mahi-accent">▸</span>
            <p className="font-mono text-sm tracking-tight text-white/45">
              'Cybernetic cityscape at sunset, ultra-realistic, 8k'
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex border border-mahi-outlineVariant/30 p-1">
            <button className="bg-[#111111] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Current
            </button>
            <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Archive
            </button>
          </div>

          <button className="flex items-center gap-2 border border-mahi-accent px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {images.map((src, index) => (
          <div
            key={src}
            className="group relative aspect-[16/10] overflow-hidden border border-mahi-outlineVariant/30"
          >
            <img
              src={src}
              alt={`Result ${index + 1}`}
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />

            <div className="absolute inset-0 flex flex-col justify-between bg-black/80 p-6 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <div className="flex justify-end gap-2">
                <button className="border border-white/20 p-2 text-white transition-all hover:border-mahi-accent hover:text-mahi-accent">
                  <FolderPlus size={15} />
                </button>
                <button className="border border-red-400/20 p-2 text-red-300 transition-all hover:border-red-400">
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="flex flex-1 items-center justify-center gap-2 border border-white py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black">
                  <Download size={14} />
                  Download
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 border border-mahi-accent py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black">
                  <ArrowUpCircle size={14} />
                  {index === 1 ? "Canvas" : "Upscale"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-4 border border-mahi-outlineVariant/30 p-1">
          <button className="flex h-10 w-10 items-center justify-center text-white/35 hover:text-mahi-accent">
            ‹
          </button>
          <div className="flex items-center gap-3 px-4 font-mono text-[10px] tracking-[0.2em]">
            <span className="text-mahi-accent">01</span>
            <span className="text-white/10">|</span>
            <span className="text-white/35">12</span>
          </div>
          <button className="flex h-10 w-10 items-center justify-center text-white/35 hover:text-mahi-accent">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}