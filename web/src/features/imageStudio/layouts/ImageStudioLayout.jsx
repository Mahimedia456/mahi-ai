import { NavLink, Outlet } from "react-router-dom";
import { Sparkles, Wand2, FolderKanban, History, SlidersHorizontal } from "lucide-react";

const navItems = [
  { label: "Create", to: ".", end: true, icon: Sparkles },
  { label: "Generating", to: "generating", icon: Wand2 },
  { label: "Results", to: "results", icon: Sparkles },
  { label: "Assets", to: "assets", icon: FolderKanban },
  { label: "History", to: "history", icon: History },
  { label: "Presets", to: "presets", icon: SlidersHorizontal },
];

export default function ImageStudioLayout() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-white">
      <div className="border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-6 py-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#53f5e7]">
                Image Studio
              </p>
              <h1
                className="mt-2 text-2xl font-extrabold uppercase tracking-[-0.06em] text-white md:text-3xl"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                AI Image Generation
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/40">
                Generate, iterate, review outputs, and manage assets from one structured image workflow.
              </p>
            </div>

            <NavLink
              to="/app/image-editor/home"
              className="rounded-full border border-[#53f5e7]/25 bg-[#53f5e7]/[0.06] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#53f5e7] transition-all hover:border-[#53f5e7]/50 hover:bg-[#53f5e7]/10"
            >
              Open Image Editor
            </NavLink>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] transition-all ${
                      isActive
                        ? "border-[#53f5e7] bg-[#53f5e7] text-black"
                        : "border-[#53f5e7]/20 bg-transparent text-white/70 hover:border-[#53f5e7]/50 hover:bg-[#53f5e7]/[0.06] hover:text-white"
                    }`
                  }
                >
                  <Icon size={14} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}