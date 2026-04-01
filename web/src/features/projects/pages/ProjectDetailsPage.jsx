import { Link } from "react-router-dom";
import {
  Plus,
  Settings,
  Play,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const projectAssets = [
  {
    title: "Glacial Fracture #01",
    tag: "Hero_Asset_01 // 4K_RAW",
    type: "image",
    large: true,
    image:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "",
    tag: "",
    type: "image",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "",
    tag: "",
    type: "video",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Synthetic Drift",
    tag: "Device_Asset_04",
    type: "image",
    tall: true,
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "",
    tag: "",
    type: "image",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
];

export default function ProjectDetailsPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-black">
      <header className="sticky top-16 z-20 flex h-16 items-center justify-between border-b border-mahi-accent/20 bg-black px-8">
        <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.2em]">
          <span className="text-white/35">Projects</span>
          <span className="text-white/20">/</span>
          <span className="font-bold text-mahi-accent">Winter Campaign 2024</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-white/35 transition-colors hover:text-mahi-accent">
            <span className="absolute right-0 top-0 h-1.5 w-1.5 bg-mahi-accent shadow-[0_0_5px_#53f5e7]" />
            •
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-10 py-12">
        <section className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <span className="border border-mahi-accent/50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent">
                Active_System_04
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/35">
                Sync: Nov 12, 2024
              </span>
            </div>

            <h1 className="theme-heading text-[5rem] font-bold leading-[0.9] tracking-tight text-white">
              Winter Campaign
              <br />
              2024
            </h1>

            <p className="mt-8 max-w-lg text-sm uppercase tracking-[0.12em] leading-8 text-white/35">
              Synthetic visual identity and generative marketing assets for the
              Q4 global launch. Focused on crystalline textures and obsidian depth.
            </p>

            <div className="mt-12 flex items-center gap-12">
              <div>
                <span className="theme-heading block text-5xl font-bold text-white">
                  24
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent">
                  Generated_Assets
                </span>
              </div>

              <div>
                <span className="theme-heading block text-5xl font-bold text-white">
                  1.2<span className="text-2xl">GB</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent">
                  Storage_Allocation
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-mahi-accent px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_15px_rgba(83,245,231,0.3)]">
              <Plus size={16} />
              Add Asset
            </button>

            <button className="border border-mahi-accent/30 p-3 text-white transition-all hover:border-mahi-accent hover:text-mahi-accent">
              <Settings size={18} />
            </button>
          </div>
        </section>

        <nav className="mb-10 flex gap-12 overflow-x-auto border-b border-mahi-accent/20 whitespace-nowrap">
          <button className="pb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
            Overview
          </button>
          <button className="border-b-2 border-mahi-accent pb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-mahi-accent">
            Media_Library
          </button>
          <button className="pb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
            Prompts
          </button>
          <button className="pb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
            Logs
          </button>
        </nav>

        <div className="mb-12 flex items-center justify-between border-y border-mahi-accent/20 py-3">
          <div className="flex items-center gap-6">
            <div className="h-1.5 w-1.5 animate-pulse bg-mahi-accent shadow-[0_0_8px_#53f5e7]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-mahi-accent">
              AI_Engine // Processing_Latent_Space_Optimizations
            </p>
          </div>

          <div className="relative h-px w-64 overflow-hidden bg-mahi-accent/10">
            <div className="absolute inset-y-0 left-0 w-[65%] bg-mahi-accent shadow-[0_0_10px_rgba(83,245,231,0.4)]" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="group relative aspect-square overflow-hidden border border-mahi-accent/20 transition-all duration-500 hover:border-mahi-accent/50 md:col-span-2 md:row-span-2">
            <img
              src={projectAssets[0].image}
              alt={projectAssets[0].title}
              className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-40" />

            <div className="absolute bottom-8 left-8 right-8">
              <span className="mb-3 block text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent">
                {projectAssets[0].tag}
              </span>
              <h3 className="theme-heading text-4xl font-bold tracking-tight text-white">
                {projectAssets[0].title}
              </h3>

              <div className="mt-6 flex items-center gap-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <button className="flex h-12 w-12 items-center justify-center bg-mahi-accent text-black shadow-[0_0_15px_rgba(83,245,231,0.3)]">
                  <Play size={18} />
                </button>
                <button className="border border-white/20 px-6 py-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white transition-colors hover:border-mahi-accent hover:text-mahi-accent">
                  Download
                </button>
              </div>
            </div>
          </div>

          {projectAssets.slice(1, 3).map((asset, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden border border-mahi-accent/20 transition-all hover:border-mahi-accent/50"
            >
              <img
                src={asset.image}
                alt="asset"
                className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-mahi-accent">VIEW</span>
              </div>
              <div className="absolute right-0 top-0 border-b border-l border-mahi-accent/40 bg-black/80 p-2 text-mahi-accent">
                {asset.type === "video" ? "VID" : "IMG"}
              </div>
            </div>
          ))}

          <div className="group relative overflow-hidden border border-mahi-accent/20 transition-all hover:border-mahi-accent/50 md:row-span-2">
            <img
              src={projectAssets[3].image}
              alt={projectAssets[3].title}
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
            />
            <div className="absolute bottom-8 left-8">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent">
                {projectAssets[3].tag}
              </p>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                {projectAssets[3].title}
              </p>
            </div>
          </div>

          <div className="group relative aspect-square overflow-hidden border border-mahi-accent/20 transition-all hover:border-mahi-accent/50">
            <img
              src={projectAssets[4].image}
              alt="asset"
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
            />
            <div className="absolute right-0 top-0 border-b border-l border-mahi-accent/40 bg-black/80 p-2 text-mahi-accent">
              IMG
            </div>
          </div>

          <div className="group relative aspect-square cursor-pointer overflow-hidden border border-dashed border-mahi-accent/30 transition-all hover:border-mahi-accent">
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <span className="mb-4 text-4xl text-white/15 transition-colors group-hover:text-mahi-accent">
                ⬆
              </span>
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/25 group-hover:text-white">
                System_Upload
                <br />
                Push To_Cloud
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-20 flex items-center justify-between border-t border-mahi-accent/20 pt-10">
          <div className="flex items-center gap-12">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/25">
              Showing_06 // Cap_24
            </p>
            <div className="flex items-center gap-6">
              <button className="text-white/25 transition-colors hover:text-mahi-accent">
                <ChevronLeft size={20} />
              </button>
              <button className="text-white/25 transition-colors hover:text-mahi-accent">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/25">
              Global_Export
            </span>
            <button className="border border-mahi-accent/40 p-3 text-mahi-accent shadow-[0_0_15px_rgba(83,245,231,0.15)] transition-all hover:bg-mahi-accent hover:text-black">
              <Download size={20} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}