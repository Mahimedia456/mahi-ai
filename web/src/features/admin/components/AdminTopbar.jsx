import { NavLink } from "react-router-dom";
import { Bell, Search, Settings } from "lucide-react";

const topNavItems = [
  { label: "Models", to: "/admin/models" },
  { label: "Analytics", to: "/admin/analytics" },
  { label: "Logs", to: "/admin/logs" },
];

export default function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#121212]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[58px] max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative hidden w-full max-w-[250px] md:block">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7a78]"
            />
            <input
              type="text"
              placeholder="Search system modules..."
              className="h-9 w-full rounded-lg border border-white/5 bg-[#1b1b1b] pl-9 pr-3 text-[12px] text-white outline-none placeholder:text-[#6f7a78] focus:border-[#53f5e7]/30"
            />
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
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-[#1b1b1b] text-[#92a09d] transition hover:text-white"
          >
            <Bell size={14} />
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-[#1b1b1b] text-[#92a09d] transition hover:text-white"
          >
            <Settings size={14} />
          </button>

          <div className="ml-2 flex items-center gap-2 rounded-lg border border-white/5 bg-[#1b1b1b] px-2.5 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#53f5e7]/10 text-[11px] font-bold text-[#53f5e7]">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] font-semibold text-white">Admin Root</p>
              <p className="text-[10px] text-[#6f7a78]">System Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}