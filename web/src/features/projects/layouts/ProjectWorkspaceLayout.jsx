import { NavLink, Outlet } from "react-router-dom";
import {
  FolderOpen,
  Images,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const sideItems = [
  { label: "Home", to: "/app", icon: FolderOpen, disabled: false },
  { label: "Projects", to: "/app/projects", icon: FolderOpen },
  { label: "Media", to: "/app/media-library", icon: Images },
  { label: "Analytics", to: "/app/analytics", icon: BarChart3 },
  { label: "Settings", to: "/app/settings", icon: Settings },
];

function WorkspaceLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/app/projects"}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition-all duration-200",
          isActive
            ? "border-l-2 border-mahi-accent bg-mahi-accent/8 text-mahi-accent"
            : "text-white/38 hover:text-mahi-accent hover:bg-mahi-accent/[0.03]",
        ].join(" ")
      }
    >
      <Icon size={16} strokeWidth={1.9} />
      <span className="font-semibold">{item.label}</span>
    </NavLink>
  );
}

export default function ProjectWorkspaceLayout() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-black">
      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-64 shrink-0 border-r border-mahi-accent/20 bg-black lg:flex lg:flex-col">
          <div className="px-8 py-8">
            <h1 className="theme-heading text-3xl font-bold tracking-tight text-white">
              Mahi AI
            </h1>
            <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.28em] text-mahi-accent/70">
              Digital Architect v2.0
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            {sideItems.map((item) => (
              <WorkspaceLink key={item.label} item={item} />
            ))}
          </nav>

          <div className="mt-auto px-6 pb-8">
            <div className="mb-6 border-t border-mahi-accent/10 pt-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-mahi-accent/60">
                  System Storage
                </p>
                <p className="text-[8px] font-bold text-mahi-accent">75%</p>
              </div>
              <div className="h-px bg-mahi-accent/15">
                <div className="h-px w-3/4 bg-mahi-accent" />
              </div>
            </div>

            <button className="mb-8 w-full border border-mahi-accent py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black">
              Upgrade Access
            </button>

            <div className="space-y-3">
              <button className="flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-white/32 transition-colors hover:text-mahi-accent">
                <HelpCircle size={15} />
                Support
              </button>
              <button className="flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-white/32 transition-colors hover:text-red-300">
                <LogOut size={15} />
                Exit Session
              </button>
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