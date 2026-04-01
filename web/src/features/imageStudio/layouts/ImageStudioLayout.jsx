import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  SlidersHorizontal,
  History,
  FolderOpen,
  ImagePlus,
  WandSparkles,
  ScanSearch,
  ArrowUpSquare,
  Plus,
} from "lucide-react";

const studioNav = [
  { label: "Generate", to: "/app/image-studio", icon: Sparkles, end: true },
  { label: "Presets", to: "/app/image-studio/presets", icon: SlidersHorizontal },
  { label: "History", to: "/app/image-studio/history", icon: History },
  { label: "Assets", to: "/app/image-studio/assets", icon: FolderOpen },
];

const editorNav = [
  { label: "Editor", to: "/app/image-editor", icon: ImagePlus, end: true },
  { label: "Magic Tools", to: "/app/image-editor/magic-tools", icon: WandSparkles },
  { label: "Generative Fill", to: "/app/image-editor/generative-fill", icon: ScanSearch },
  { label: "Upscale", to: "/app/image-editor/upscale", icon: ArrowUpSquare },
  { label: "History", to: "/app/image-editor/history", icon: History },
];

function StudioNavLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        [
          "flex items-center gap-4 px-3 py-3 text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-200",
          isActive
            ? "text-mahi-accent border-l-2 border-mahi-accent bg-mahi-accent/5"
            : "text-white/35 hover:text-white",
        ].join(" ")
      }
    >
      <Icon size={16} strokeWidth={1.9} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function ImageStudioLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isEditor = location.pathname.startsWith("/app/image-editor");
  const navItems = isEditor ? editorNav : studioNav;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black">
      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-64 shrink-0 border-r border-mahi-outlineVariant/30 bg-black lg:flex lg:flex-col">
          <div className="p-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-mahi-accent text-mahi-accent">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="theme-heading text-sm font-bold text-white">
                  Studio
                </div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-mahi-accent/60">
                  {isEditor ? "Image Transformation" : "v2.4 Synthetic"}
                </div>
              </div>
            </div>

            {!isEditor ? (
              <button
                type="button"
                onClick={() => navigate("/app/image-studio")}
                className="flex w-full items-center justify-center gap-2 bg-mahi-accent px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_24px_rgba(83,245,231,0.18)] transition-all hover:scale-[1.01]"
              >
                <Plus size={16} />
                New Project
              </button>
            ) : (
              <button
                type="button"
                className="w-full border border-mahi-accent px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black"
              >
                Export Image
              </button>
            )}
          </div>

          <nav className="space-y-1 px-4">
            {navItems.map((item) => (
              <StudioNavLink key={item.label} item={item} />
            ))}
          </nav>

          <div className="mt-auto p-4">
            <div className="border border-mahi-outlineVariant/30 p-4">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/45">
                {isEditor ? "Network Online" : "Core Allocation"}
              </p>
              <div className="mt-3 h-[2px] w-full bg-white/10">
                <div className="h-full w-3/4 bg-mahi-accent" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[9px] text-mahi-accent/70">
                <span>{isEditor ? "Active Node" : "750 / 1000 SYNC"}</span>
                <span>75%</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}