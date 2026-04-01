import { NavLink, Outlet } from "react-router-dom";
import {
  Shield,
  Users,
  BadgeDollarSign,
  CreditCard,
  BarChart3,
  Cpu,
  ScrollText,
} from "lucide-react";

const adminItems = [
  { label: "Dashboard", path: "/admin", icon: Shield, end: true },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Plans", path: "/admin/plans", icon: BadgeDollarSign },
  { label: "Subscriptions", path: "/admin/subscriptions", icon: CreditCard },
  { label: "Usage", path: "/admin/usage", icon: BarChart3 },
  { label: "Models", path: "/admin/models", icon: Cpu },
  { label: "Logs", path: "/admin/logs", icon: ScrollText },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-mahi-bg text-mahi-text">
      <aside className="w-72 shrink-0 border-r border-mahi-border bg-black/70 p-6">
        <h1 className="mb-8 text-3xl font-bold">Mahi AI Admin</h1>

        <nav className="space-y-2">
          {adminItems.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-mahi-border bg-black/40 px-8">
          <h2 className="text-xl font-semibold">Admin Control Panel</h2>
          <div className="rounded-full border border-mahi-border px-4 py-2 text-sm text-mahi-accent">
            System Secure
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}