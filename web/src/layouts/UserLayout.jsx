import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  CreditCard,
  FolderOpen,
  History,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  User,
  Video,
  Wand2,
  X,
  ArrowUpCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import mahiLogo from "../assets/logo.png";

const primaryNav = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard, end: true },
  { label: "AI Chat", to: "/app/chat", icon: MessageSquare },
  { label: "Image Studio", to: "/app/image-studio", icon: Sparkles },
  { label: "Image Editor", to: "/app/image-editor", icon: ImagePlus },
  { label: "Video Studio", to: "/app/video-studio", icon: Video },
];

const topWorkspaceNav = [
  { label: "Projects", to: "/app/projects", icon: FolderOpen },
  { label: "Media Library", to: "/app/media-library", icon: Sparkles },
  { label: "Prompt History", to: "/app/prompt-history", icon: History },
  { label: "Billing", to: "/app/billing", icon: CreditCard },
  { label: "Upgrade", to: "/app/pricing", icon: ArrowUpCircle },
];

const notifications = [
  {
    id: 1,
    title: "Render complete",
    text: "Your Motion Flow video export finished successfully.",
    time: "2m ago",
    icon: CheckCircle2,
  },
  {
    id: 2,
    title: "Storage warning",
    text: "You have used 82% of your media storage allocation.",
    time: "18m ago",
    icon: Info,
  },
  {
    id: 3,
    title: "Billing renewal",
    text: "Your Pro Plan will renew in 12 days.",
    time: "1h ago",
    icon: CreditCard,
  },
];

function SidebarLink({ item, compact = false, onClick }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          compact
            ? "group flex w-full flex-col items-center gap-2 px-2 py-3 text-center transition-all duration-200"
            : "app-nav-link",
          isActive ? "app-nav-link-active" : "",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={[
              compact ? "app-icon-box h-10 w-10" : "app-icon-box",
              isActive
                ? "border-mahi-accent/50 bg-mahi-accent/5 text-mahi-accent"
                : "text-white/55",
            ].join(" ")}
          >
            <Icon size={18} strokeWidth={1.85} />
          </span>

          {compact ? (
            <span
              className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${
                isActive ? "text-mahi-accent" : "text-white/28"
              }`}
            >
              {item.label}
            </span>
          ) : (
            <span className="font-medium">{item.label}</span>
          )}
        </>
      )}
    </NavLink>
  );
}

function TopNavLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        [
          "hidden items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] transition-colors md:flex",
          isActive ? "text-mahi-accent" : "text-white/34 hover:text-white",
        ].join(" ")
      }
    >
      <Icon size={14} strokeWidth={2} />
      <span>{item.label}</span>
    </NavLink>
  );
}

function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center text-white/55 transition-colors hover:text-mahi-accent"
      >
        <Bell size={18} />
        <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-mahi-accent shadow-[0_0_8px_rgba(83,245,231,0.8)]" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[80] w-[340px] border border-mahi-outlineVariant/35 bg-[#0c0c0c] shadow-[0_0_30px_rgba(83,245,231,0.06)]">
          <div className="flex items-center justify-between border-b border-mahi-outlineVariant/20 px-4 py-4">
            <div>
              <p className="theme-heading text-sm font-bold text-white">
                Notifications
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/30">
                Live updates
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/app/notifications");
              }}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent transition-colors hover:text-white"
            >
              View all
            </button>
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/app/notifications");
                  }}
                  className="flex w-full items-start gap-3 border-b border-mahi-outlineVariant/10 px-4 py-4 text-left transition-all hover:bg-white/[0.03]"
                >
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center border border-mahi-accent/20 bg-mahi-accent/5 text-mahi-accent">
                    <Icon size={16} strokeWidth={1.9} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="theme-heading text-sm font-bold text-white">
                        {item.title}
                      </p>
                      <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-white/25">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-6 text-white/45">
                      {item.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileDropdown({ userName, userEmail, initials, onLogout }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const menuItems = [
    {
      label: "Account",
      icon: User,
      action: () => navigate("/app/profile"),
    },
    {
      label: "Billing",
      icon: CreditCard,
      action: () => navigate("/app/billing"),
    },
    {
      label: "Upgrade",
      icon: ArrowUpCircle,
      action: () => navigate("/app/pricing"),
    },
    {
      label: "Settings",
      icon: Settings,
      action: () => navigate("/app/settings"),
    },
  ];

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 border border-mahi-outlineVariant/35 bg-black px-3 py-2 transition-all hover:border-mahi-accent/35"
      >
        <div className="hidden text-right md:block">
          <p className="theme-heading text-sm font-bold text-white">
            {userName}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-white/35">
            Pro Member
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center overflow-hidden border border-mahi-accent/30 bg-mahi-accent/5 text-sm font-bold text-mahi-accent">
          {initials}
        </div>

        <ChevronDown
          size={15}
          className={`hidden text-white/45 transition-transform md:block ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[80] w-[250px] border border-mahi-outlineVariant/35 bg-[#0c0c0c] p-2 shadow-[0_0_30px_rgba(83,245,231,0.06)]">
          <div className="border-b border-mahi-outlineVariant/20 px-3 py-3">
            <p className="theme-heading text-sm font-bold text-white">
              {userName}
            </p>
            <p className="mt-1 text-xs text-white/40">{userEmail}</p>
          </div>

          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    item.action();
                  }}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm text-white/65 transition-all hover:bg-white/[0.03] hover:text-white"
                >
                  <Icon size={16} strokeWidth={1.9} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-mahi-outlineVariant/20 pt-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm text-red-300/90 transition-all hover:bg-red-400/[0.05] hover:text-red-300"
            >
              <LogOut size={16} strokeWidth={1.9} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("mahi_user") || "{}");
  const userName = storedUser?.fullName || "Alex Rivera";
  const userEmail = storedUser?.email || "alex@company.com";

  const initials = useMemo(() => {
    const source = userName || userEmail || "A";
    return source.trim().charAt(0).toUpperCase();
  }, [userName, userEmail]);

  function handleLogout() {
    localStorage.removeItem("mahi_auth_token");
    localStorage.removeItem("mahi_admin_auth");
    localStorage.removeItem("mahi_user");
    localStorage.removeItem("mahi_reset_email");
    localStorage.removeItem("mahi_reset_otp");
    localStorage.removeItem("mahi_otp_verified");
    navigate("/login", { replace: true });
  }

  const isChatScreen = location.pathname.startsWith("/app/chat");

  return (
    <div className="app-shell relative overflow-hidden">
      <div className="app-grid-overlay pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(83,245,231,0.025),transparent_42%)]" />

      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-mahi-outlineVariant/30 bg-[#0b0b0b]/95 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center border border-mahi-outlineVariant/40 text-white/70 md:hidden"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center">
                <img
                  src={mahiLogo}
                  alt="Mahi AI"
                  className="h-8 w-auto object-contain md:h-10"
                />
              </div>

              <div className="hidden items-center gap-5 md:flex">
                <span className="app-mono text-sm font-semibold uppercase tracking-tight text-mahi-accent">
                  Mahi Ai
                </span>

                {topWorkspaceNav.map((item) => (
                  <TopNavLink key={item.label} item={item} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isChatScreen && (
              <button
                type="button"
                className="hidden h-10 items-center border border-mahi-accent/50 px-4 text-[11px] font-bold uppercase tracking-[0.24em] text-mahi-accent transition-all hover:bg-mahi-accent/5 lg:inline-flex"
              >
                Quick Create
              </button>
            )}

            <NotificationsDropdown />

            <button
              type="button"
              onClick={() => navigate("/app/settings")}
              className="hidden h-10 w-10 items-center justify-center text-white/55 transition-colors hover:text-mahi-accent md:flex"
            >
              <Settings size={18} />
            </button>

            <ProfileDropdown
              userName={userName}
              userEmail={userEmail}
              initials={initials}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-24 border-r border-mahi-outlineVariant/35 bg-[#0b0b0b]/95 md:flex">
        <div className="flex h-full w-full flex-col items-center py-5">
          <div className="mb-6 shrink-0">
            <div className="app-icon-box h-12 w-12 border-mahi-accent/40 bg-black text-mahi-accent">
              <Wand2 size={20} />
            </div>
          </div>

          <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-start gap-3 overflow-hidden">
            {primaryNav.map((item) => (
              <SidebarLink key={item.label} item={item} compact />
            ))}
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[310px] border-r border-mahi-outlineVariant/35 bg-[#0b0b0b] p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="theme-heading text-2xl font-bold text-white">
                  Mahi AI
                </h2>
                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-white/30">
                  Synthetic Intelligence
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center border border-mahi-outlineVariant/40 text-white/70"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-6 flex items-center gap-3 border border-mahi-outlineVariant/30 px-4 py-3">
              <Search size={16} className="text-white/35" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
              />
            </div>

            <div className="space-y-1">
              {primaryNav.map((item) => (
                <SidebarLink
                  key={item.label}
                  item={item}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>

            <div className="mt-8 border-t border-mahi-outlineVariant/25 pt-5">
              <p className="app-label px-4">Workspace</p>
              <div className="mt-3 space-y-1">
                {topWorkspaceNav.map((item) => (
                  <SidebarLink
                    key={item.label}
                    item={item}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
                <SidebarLink
                  item={{ label: "Account", to: "/app/profile", icon: User }}
                  onClick={() => setMobileOpen(false)}
                />
                <SidebarLink
                  item={{ label: "Notifications", to: "/app/notifications", icon: Bell }}
                  onClick={() => setMobileOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="pt-16 md:pl-24">
        <Outlet />
      </main>
    </div>
  );
}