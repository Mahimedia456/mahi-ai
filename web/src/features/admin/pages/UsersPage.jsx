import { useMemo, useState } from "react";
import UsersStatCard from "../components/users/UsersStatCard";
import UsersTable from "../components/users/UsersTable";
import { users } from "../data/usersData";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.plan.toLowerCase().includes(value)
    );
  }, [search]);

  const activeUsers = users.filter((u) => u.status === "active").length;
  const suspendedUsers = users.filter((u) => u.status === "suspended").length;

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
          User Management
        </p>
        <h1
          className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          All Users
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Monitor account status, plan usage, engagement, and access state for all Mahi AI users.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <UsersStatCard title="Total Users" value={users.length} hint="All registered accounts" />
        <UsersStatCard title="Active Users" value={activeUsers} hint="Healthy active accounts" />
        <UsersStatCard title="Suspended Users" value={suspendedUsers} hint="Restricted accounts" />
        <UsersStatCard title="Pro & Enterprise" value={2} hint="High-value subscriptions" />
      </section>

      <section className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2
              className="text-[20px] font-bold tracking-[-0.03em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Users Directory
            </h2>
            <p className="mt-1 text-sm text-[#94a29f]">
              Search and inspect user account records.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-2xl border border-white/5 bg-[#141414] px-4 text-sm text-white outline-none placeholder:text-[#697572] md:max-w-[320px]"
          />
        </div>

        <div className="mt-5">
          <UsersTable data={filteredUsers} />
        </div>
      </section>
    </div>
  );
}