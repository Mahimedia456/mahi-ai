import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Clapperboard,
  History,
  Library,
  CreditCard,
  LayoutDashboard,
  Plus,
  CircleHelp,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "Video Studio", to: "/app/video-studio", icon: Clapperboard, end: true },
  { label: "History", to: "/app/video-studio/history", icon: History },
  { label: "Team Library", to: "/app/video-studio/library", icon: Library },
  { label: "Billing", to: "/app/billing", icon: CreditCard },
];

function VideoNavLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        [
          "flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-[0.2em] transition-all duration-200",
          isActive
            ? "border-l-2 border-mahi-accent bg-mahi-accent/5 text-mahi-accent"
            : "text-white/35 hover:text-mahi-accent",
        ].join(" ")
      }
    >
      <Icon size={16} strokeWidth={1.9} />
      <span className="font-semibold">{item.label}</span>
    </NavLink>
  );
}

export default function VideoStudioLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/app/video-studio";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black">
      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-64 shrink-0 border-r border-mahi-accent/20 bg-black lg:flex lg:flex-col">
          <div className="px-8 py-8">
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-mahi-accent text-mahi-accent">
                <Clapperboard size={16} />
              </div>

              <div>
                <h2 className="theme-heading text-lg font-bold italic tracking-tight text-white">
                  Mahi AI
                </h2>
                <p className="text-[9px] uppercase tracking-[0.3em] text-mahi-accent/60">
                  Digital Architect
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <VideoNavLink key={item.label} item={item} />
              ))}
            </nav>
          </div>

          <div className="mt-auto px-4 pb-8">
            <button
              type="button"
              onClick={() => navigate("/app/video-studio")}
              className="mb-6 flex w-full items-center justify-center gap-2 border border-mahi-accent/30 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent transition-all hover:border-mahi-accent hover:bg-mahi-accent/10"
            >
              <Plus size={15} />
              New Generation
            </button>

            <div className="space-y-3 border-t border-mahi-accent/10 px-2 pt-6">
              <button className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/28 transition-colors hover:text-mahi-accent">
                <CircleHelp size={15} />
                Support
              </button>
              <button className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/28 transition-colors hover:text-red-300">
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-16 z-20 border-b border-mahi-accent/20 bg-black/95 px-10 py-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-6">
              <div className="flex border border-mahi-accent/20 p-0.5">
                <NavLink
                  to="/app/video-studio"
                  end
                  className={({ isActive }) =>
                    `px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                      isActive
                        ? "bg-mahi-accent text-black"
                        : "text-white/40 hover:text-mahi-accent"
                    }`
                  }
                >
                  Text to Video
                </NavLink>

                <NavLink
                  to="/app/video-studio/frame-to-video"
                  className={({ isActive }) =>
                    `px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                      isActive
                        ? "bg-mahi-accent text-black"
                        : "text-white/40 hover:text-mahi-accent"
                    }`
                  }
                >
                  Frame to Video
                </NavLink>
              </div>

              <div className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                {isHome ? "VIDEO_INIT_SYSTEM" : "VIDEO_OUTPUT_SYSTEM"}
              </div>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}