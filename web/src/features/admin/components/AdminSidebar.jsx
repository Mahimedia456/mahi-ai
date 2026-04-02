import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  Users,
  CreditCard,
  FolderKanban,
  HardDrive,
  ShieldCheck,
  LogOut,
  Settings,
} from "lucide-react";
import logo from "../../../assets/logo.png";

const mainMenuGroups = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/admin/dashboard",
    children: [],
  },
  {
    label: "Users",
    icon: Users,
    children: [
      { label: "All Users", to: "/admin/users" },
      { label: "Suspended Users", to: "/admin/users/suspended" },
      { label: "User Activity", to: "/admin/users/activity" },
    ],
  },
  {
    label: "Subscriptions",
    icon: CreditCard,
    children: [
      { label: "Plans", to: "/admin/subscriptions/plans" },
      { label: "Transactions", to: "/admin/subscriptions/transactions" },
      { label: "Refunds", to: "/admin/subscriptions/refunds" },
    ],
  },
  {
    label: "Content",
    icon: FolderKanban,
    children: [
      { label: "Images", to: "/admin/content/images" },
      { label: "Videos", to: "/admin/content/videos" },
      { label: "Reported Content", to: "/admin/content/reported" },
    ],
  },
  {
    label: "Storage",
    icon: HardDrive,
    children: [
      { label: "Usage", to: "/admin/storage/usage" },
      { label: "Media Buckets", to: "/admin/storage/buckets" },
    ],
  },
];

const bottomMenuGroups = [
  {
    label: "Settings",
    icon: Settings,
    to: "/admin/settings",
  },
];

function isGroupActive(group, pathname) {
  if (group.to) return pathname === group.to || pathname.startsWith(`${group.to}/`);
  return group.children?.some((child) => pathname.startsWith(child.to));
}

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const allGroups = useMemo(
    () => [...mainMenuGroups, ...bottomMenuGroups],
    []
  );

  const initialOpenMenus = useMemo(() => {
    const state = {};
    allGroups.forEach((group) => {
      state[group.label] = isGroupActive(group, location.pathname);
    });
    return state;
  }, [allGroups, location.pathname]);

  const [openMenus, setOpenMenus] = useState(initialOpenMenus);

  useEffect(() => {
    const nextState = {};
    allGroups.forEach((group) => {
      nextState[group.label] =
        group.children?.length > 0 && isGroupActive(group, location.pathname);
    });
    setOpenMenus((prev) => ({ ...prev, ...nextState }));
  }, [location.pathname, allGroups]);

  function toggleMenu(label) {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  }

  function handleLogout() {
    localStorage.removeItem("mahi_admin_auth");
    localStorage.removeItem("mahi_auth_token");
    localStorage.removeItem("mahi_user");
    navigate("/login", { replace: true });
  }

  function renderGroup(group) {
    const Icon = group.icon;
    const active = isGroupActive(group, location.pathname);

    if (!group.children || group.children.length === 0) {
      return (
        <NavLink
          key={group.label}
          to={group.to}
          className={({ isActive }) =>
            [
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
              isActive
                ? "bg-[#1b1b1b] text-[#53f5e7] shadow-[inset_0_0_0_1px_rgba(83,245,231,0.14)]"
                : "text-[#8a9694] hover:bg-[#161616] hover:text-white",
            ].join(" ")
          }
        >
          <span
            className={[
              "flex h-8 w-8 items-center justify-center rounded-lg",
              active
                ? "bg-[#53f5e7]/10 text-[#53f5e7]"
                : "bg-white/[0.03] text-[#7f8a88]",
            ].join(" ")}
          >
            <Icon size={16} />
          </span>

          <span className="text-[12px] font-semibold">{group.label}</span>
        </NavLink>
      );
    }

    const isOpen = openMenus[group.label];

    return (
      <div key={group.label} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleMenu(group.label)}
          className={[
            "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-200",
            active
              ? "bg-[#1b1b1b] text-[#53f5e7] shadow-[inset_0_0_0_1px_rgba(83,245,231,0.14)]"
              : "text-[#8a9694] hover:bg-[#161616] hover:text-white",
          ].join(" ")}
        >
          <span className="flex items-center gap-3">
            <span
              className={[
                "flex h-8 w-8 items-center justify-center rounded-lg",
                active
                  ? "bg-[#53f5e7]/10 text-[#53f5e7]"
                  : "bg-white/[0.03] text-[#7f8a88]",
              ].join(" ")}
            >
              <Icon size={16} />
            </span>

            <span className="text-[12px] font-semibold">{group.label}</span>
          </span>

          <ChevronDown
            size={15}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen ? (
          <div className="ml-4 space-y-1 border-l border-white/5 pl-4">
            {group.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium transition-all",
                    isActive
                      ? "bg-[#53f5e7]/10 text-[#53f5e7]"
                      : "text-[#7d8886] hover:bg-[#151515] hover:text-white",
                  ].join(" ")
                }
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                <span>{child.label}</span>
              </NavLink>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] border-r border-white/5 bg-[#0f0f0f] lg:flex">
      <div className="flex h-full w-full flex-col px-4 py-5">
        <div className="px-2">
          <img
            src={logo}
            alt="Mahi AI"
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="mt-5 rounded-2xl border border-white/5 bg-[#161616] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#53f5e7]/10 text-[#53f5e7]">
              <ShieldCheck size={16} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-white">
                Admin Console
              </p>
              <p className="truncate text-[11px] text-[#788381]">
                System Overview
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-5 flex-1 space-y-2 pr-1">
          {mainMenuGroups.map(renderGroup)}
        </nav>

        <div className="space-y-2 border-t border-white/5 pt-4">
          {bottomMenuGroups.map(renderGroup)}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[#8a9694] transition-all duration-200 hover:bg-[#161616] hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-[#7f8a88]">
              <LogOut size={16} />
            </span>
            <span className="text-[12px] font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}