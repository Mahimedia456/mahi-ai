import { Camera, Search, ShieldCheck } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-black">
      <header className="sticky top-16 z-20 flex items-center justify-between border-b border-mahi-accent/10 bg-black px-12 py-8 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <h2 className="theme-heading text-2xl font-bold uppercase tracking-tight text-white">
            Control_Panel.exe
          </h2>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative flex items-center border-b border-mahi-accent/30 px-0">
            <Search size={14} className="mr-3 text-mahi-accent" />
            <input
              type="text"
              placeholder="SEARCH_DATABASE..."
              className="w-48 bg-transparent py-1.5 text-[11px] uppercase tracking-widest text-white placeholder:text-white/20 outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="text-white/35 transition-colors hover:text-mahi-accent">
              •
            </button>
            <div className="h-8 w-8 overflow-hidden border border-mahi-accent/30 bg-white/5" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-12">
        <div className="mb-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="mb-4 block text-[10px] uppercase tracking-[0.4em] text-mahi-accent/60">
                // SYSTEM_PROFILE
              </span>
              <h1 className="theme-heading text-6xl font-bold uppercase tracking-tight text-white">
                Identity_Core
              </h1>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
                STATUS: OPTIMIZED_100%
              </p>
            </div>
          </div>

          <div className="flex gap-12 border-b border-mahi-accent/10">
            <button className="border-b-2 border-mahi-accent pb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Profile
            </button>
            <button className="pb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
              Security
            </button>
            <button className="pb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
              Nodes
            </button>
            <button className="pb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
              Encryption
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-16">
          <div className="col-span-12 md:col-span-4">
            <div className="flex flex-col items-center text-center">
              <div className="group relative cursor-pointer">
                <div className="flex h-40 w-40 items-center justify-center border border-mahi-accent/20 p-2 transition-all group-hover:border-mahi-accent">
                  <div className="flex h-full w-full items-center justify-center border border-mahi-accent/10 bg-black">
                    <span className="text-6xl text-white/10">👤</span>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-mahi-accent/10 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera size={20} className="text-mahi-accent" />
                </div>
              </div>

              <h3 className="mt-8 text-[11px] font-bold uppercase tracking-[0.3em] text-white">
                Avatar_Entity.sys
              </h3>

              <p className="mt-4 text-[9px] uppercase tracking-wider text-white/25">
                Formats: RAW, HEX, BLOB
                <br />
                Limit: 800KB
              </p>

              <button className="mt-8 border border-mahi-accent px-6 py-2 text-[10px] uppercase tracking-[0.3em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black">
                Re-initialize
              </button>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="border-l border-mahi-accent/10 pl-12">
              <form className="space-y-10">
                <div>
                  <label className="mb-4 block text-[9px] uppercase tracking-[0.3em] text-white/35">
                    Identity_Label
                  </label>
                  <input
                    type="text"
                    defaultValue="Alexander Sterling"
                    className="w-full border-b border-mahi-accent/20 bg-transparent pb-4 text-lg text-white outline-none transition-all focus:border-mahi-accent"
                  />
                </div>

                <div>
                  <label className="mb-4 block text-[9px] uppercase tracking-[0.3em] text-white/35">
                    Communication_Endpoint
                  </label>
                  <input
                    type="email"
                    defaultValue="alexander.sterling@mahi.ai"
                    className="w-full border-b border-mahi-accent/20 bg-transparent pb-4 text-lg text-white outline-none transition-all focus:border-mahi-accent"
                  />
                </div>

                <div>
                  <label className="mb-4 block text-[9px] uppercase tracking-[0.3em] text-white/35">
                    System_Directive / Bio
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Lead AI Architect specializing in neural network synchronization and synthetic logic workflows."
                    className="w-full border border-mahi-accent/20 bg-transparent p-4 text-sm leading-relaxed text-white outline-none transition-all focus:border-mahi-accent"
                  />
                </div>

                <div className="flex items-center justify-between pt-10">
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/35">
                    <ShieldCheck size={14} className="text-mahi-accent" />
                    <span>Encrypted via Sentinel_v4.2</span>
                  </div>

                  <button
                    type="button"
                    className="bg-mahi-accent px-12 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-black shadow-[0_0_30px_rgba(83,245,231,0.15)] transition-all hover:bg-white"
                  >
                    Sync_Changes
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 border-l border-mahi-accent/10 pl-12">
              <div className="border border-mahi-accent/10 p-6 transition-all hover:border-mahi-accent/30">
                <span className="mb-6 block text-[9px] uppercase tracking-[0.3em] text-white/35">
                  Total_Interactions
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="theme-heading text-5xl font-bold text-white">
                    1,284
                  </span>
                  <span className="text-[10px] font-bold text-mahi-accent">
                    +12.04%
                  </span>
                </div>
              </div>

              <div className="border border-mahi-accent/10 p-6 transition-all hover:border-mahi-accent/30">
                <span className="mb-6 block text-[9px] uppercase tracking-[0.3em] text-white/35">
                  Storage_Allocation
                </span>
                <div className="mb-4 h-[2px] w-full bg-mahi-accent/10">
                  <div className="h-full w-[65%] bg-mahi-accent shadow-[0_0_10px_rgba(83,245,231,0.5)]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                    6.5GB / 10GB
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-white/30">
                    L-SECTOR_A
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 flex items-center justify-between border-t border-mahi-accent/5 px-0 py-8">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 animate-pulse bg-mahi-accent" />
            <span className="text-[9px] uppercase tracking-[0.4em] text-white/35">
              NODE_STABILITY: OPTIMAL
            </span>
          </div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20">
            MAHI_OS // 2024.9.4 // CORE_GEN_01
          </p>
        </footer>
      </div>
    </div>
  );
}