import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Settings,
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  Box,
  FolderKanban,
  Bot,
  BarChart3,
  ScrollText,
  ShieldAlert,
  UserCircle2,
} from "lucide-react";

const topNavItems = [
  { label: "Models", to: "/admin/models" },
  { label: "Analytics", to: "/admin/analytics" },
  { label: "Logs", to: "/admin/logs" },
];

const searchableModules = [
  {
    label: "Dashboard",
    to: "/admin",
    description: "Overview, live platform stats, and recent activity",
    icon: LayoutDashboard,
    keywords: ["dashboard", "overview", "stats", "home"],
  },
  {
    label: "Users",
    to: "/admin/users",
    description: "Manage users, status, and account details",
    icon: Users,
    keywords: ["users", "members", "accounts"],
  },
  {
    label: "User Activity",
    to: "/admin/users/activity",
    description: "Track registrations, payments, and platform actions",
    icon: ScrollText,
    keywords: ["activity", "user activity", "timeline"],
  },
  {
    label: "Plans",
    to: "/admin/plans",
    description: "Manage subscription plans and pricing",
    icon: Package,
    keywords: ["plans", "subscriptions", "pricing"],
  },
  {
    label: "Transactions",
    to: "/admin/transactions",
    description: "Review payments and transaction history",
    icon: CreditCard,
    keywords: ["transactions", "payments", "billing"],
  },
  {
    label: "Refunds",
    to: "/admin/refunds",
    description: "Review refund requests and status",
    icon: CreditCard,
    keywords: ["refunds", "refund"],
  },
  {
    label: "Content",
    to: "/admin/content/images",
    description: "Manage generated content and moderation actions",
    icon: FolderKanban,
    keywords: ["content", "images", "videos", "reported"],
  },
  {
    label: "Storage",
    to: "/admin/storage/usage",
    description: "Inspect storage usage and media buckets",
    icon: Box,
    keywords: ["storage", "buckets", "media"],
  },
  {
    label: "Models",
    to: "/admin/models",
    description: "Manage AI models, versions, and status",
    icon: Bot,
    keywords: ["models", "ai models", "providers"],
  },
  {
    label: "Analytics",
    to: "/admin/analytics",
    description: "Platform, image, video, and revenue analytics",
    icon: BarChart3,
    keywords: ["analytics", "reports", "revenue", "charts"],
  },
  {
    label: "Logs",
    to: "/admin/logs",
    description: "API, moderation, queue, and generation logs",
    icon: ScrollText,
    keywords: ["logs", "errors", "queue", "moderation logs"],
  },
  {
    label: "Notifications",
    to: "/admin/notifications",
    description: "View admin alerts and system notifications",
    icon: Bell,
    keywords: ["notifications", "alerts"],
  },
  {
    label: "Settings",
    to: "/admin/settings",
    description: "General settings, AI limits, and blocked words",
    icon: Settings,
    keywords: ["settings", "config", "limits", "blocked words"],
  },
  {
    label: "Profile",
    to: "/admin/profile",
    description: "Update admin profile and account details",
    icon: UserCircle2,
    keywords: ["profile", "account", "admin profile"],
  },
  {
    label: "Moderation",
    to: "/admin/settings",
    description: "Moderation settings and blocked words",
    icon: ShieldAlert,
    keywords: ["moderation", "safety", "policy"],
  },
];

export default function AdminTopbar() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return searchableModules.slice(0, 6);
    }

    return searchableModules
      .map((item) => {
        const haystack = [
          item.label,
          item.description,
          ...(item.keywords || []),
        ]
          .join(" ")
          .toLowerCase();

        const starts = item.label.toLowerCase().startsWith(q) ? 3 : 0;
        const includes = haystack.includes(q) ? 2 : 0;
        const keywordHit = (item.keywords || []).some((k) =>
          k.toLowerCase().includes(q)
        )
          ? 1
          : 0;

        return {
          ...item,
          score: starts + includes + keywordHit,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setShowResults(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function goToRoute(route) {
    navigate(route);
    setShowResults(false);
    setQuery("");
  }

  function handleKeyDown(event) {
    if (!showResults) {
      if (event.key === "Enter" && filteredModules[0]) {
        goToRoute(filteredModules[0].to);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev >= filteredModules.length - 1 ? 0 : prev + 1
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? filteredModules.length - 1 : prev - 1
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (filteredModules[activeIndex]) {
        goToRoute(filteredModules[activeIndex].to);
      }
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#121212]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[58px] max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div
            ref={wrapperRef}
            className="relative hidden w-full max-w-[280px] md:block"
          >
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7a78]"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search system modules..."
              className="h-9 w-full rounded-lg border border-white/5 bg-[#1b1b1b] pl-9 pr-3 text-[12px] text-white outline-none placeholder:text-[#6f7a78] focus:border-[#53f5e7]/30"
            />

            {showResults && (
              <div className="absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-2xl border border-[#53f5e7]/10 bg-[#161616] shadow-2xl">
                <div className="border-b border-white/5 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7e8a87]">
                  Search Results
                </div>

                <div className="max-h-[360px] overflow-y-auto p-2">
                  {filteredModules.length ? (
                    filteredModules.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = index === activeIndex;

                      return (
                        <button
                          key={item.to}
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => goToRoute(item.to)}
                          className={[
                            "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all",
                            isActive
                              ? "bg-[#53f5e7]/10"
                              : "hover:bg-white/[0.04]",
                          ].join(" ")}
                        >
                          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#53f5e7]/10 text-[#53f5e7]">
                            <Icon size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">
                              {item.label}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#8c9895]">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-6 text-center text-sm text-[#8c9895]">
                      No module found for “{query}”
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {topNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-2 text-[12px] font-semibold transition-all",
                    isActive
                      ? "bg-[#1b1b1b] text-[#53f5e7]"
                      : "text-[#8b9794] hover:bg-[#181818] hover:text-white",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/admin/notifications"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-[#1b1b1b] text-[#92a09d] transition hover:text-white"
          >
            <Bell size={14} />
          </Link>

          <Link
            to="/admin/settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-[#1b1b1b] text-[#92a09d] transition hover:text-white"
          >
            <Settings size={14} />
          </Link>

          <Link
            to="/admin/profile"
            className="ml-2 flex items-center gap-2 rounded-lg border border-white/5 bg-[#1b1b1b] px-2.5 py-1.5 transition hover:border-[#53f5e7]/20"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#53f5e7]/10 text-[11px] font-bold text-[#53f5e7]">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] font-semibold text-white">Admin Root</p>
              <p className="text-[10px] text-[#6f7a78]">System Admin</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}