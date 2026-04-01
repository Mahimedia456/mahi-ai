import { NavLink, Outlet } from "react-router-dom";
import { CreditCard, HelpCircle, History, LogOut, Plus, Settings, User } from "lucide-react";

const sideItems = [
  { label: "Prompt History", to: "/app/prompt-history", icon: History },
  { label: "Billing", to: "/app/billing", icon: CreditCard },
  { label: "Settings", to: "/app/settings", icon: Settings },
  { label: "Support", to: "/app/help", icon: HelpCircle },
];

function SideLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `group flex items-center gap-4 px-6 py-3 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${
          isActive
            ? "border-r-2 border-mahi-accent bg-mahi-accent/5 text-mahi-accent"
            : "text-white/35 hover:text-mahi-accent"
        }`
      }
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function SystemPanelLayout() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-black">
      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-64 shrink-0 border-r border-mahi-accent/10 bg-black md:flex md:flex-col">
          <div className="mb-12 px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-mahi-accent text-mahi-accent">
                <User size={18} />
              </div>
              <div>
                <h1 className="theme-heading text-xl font-bold uppercase tracking-tight text-white">
                  Mahi AI
                </h1>
                <p className="text-[9px] uppercase tracking-[0.3em] text-mahi-accent/70">
                  Architect Protocol
                </p>
              </div>
            </div>
          </div>

          <div className="flex-grow space-y-1">
            {sideItems.map((item) => (
              <SideLink key={item.label} item={item} />
            ))}
          </div>

          <div className="mt-auto px-6 pb-8">
            <button className="mb-6 flex w-full items-center justify-center gap-2 border border-mahi-accent py-3 text-[11px] uppercase tracking-widest text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black">
              <Plus size={14} />
              New Command
            </button>

            <button className="flex items-center gap-4 py-3 text-[11px] uppercase tracking-widest text-white/35 transition-colors hover:text-white">
              <LogOut size={18} />
              Terminate Session
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}