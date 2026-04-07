import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersStatCard from "../components/users/UsersStatCard";
import UsersTable from "../components/users/UsersTable";
import { adminApi } from "../../../api/adminApi";

export default function UsersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return users;

    return users.filter(
      (user) =>
        String(user.name || "").toLowerCase().includes(value) ||
        String(user.email || "").toLowerCase().includes(value) ||
        String(user.plan || "").toLowerCase().includes(value) ||
        String(user.country || "").toLowerCase().includes(value)
    );
  }, [search, users]);

  const activeUsers = users.filter((u) => u.status === "active").length;
  const suspendedUsers = users.filter((u) => u.status === "suspended").length;
  const proEnterpriseUsers = users.filter((u) =>
    ["pro", "enterprise"].includes(String(u.plan || "").toLowerCase())
  ).length;

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await adminApi.getUsers();
      setUsers(res.data.data.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleDelete(user) {
    const ok = window.confirm(`Delete ${user.name}?`);
    if (!ok) return;

    try {
      await adminApi.deleteUser(user.id);
      await loadUsers();
    } catch (error) {
      alert(error?.response?.data?.message || "Delete failed");
    }
  }

  async function handleToggleStatus(user) {
    try {
      await adminApi.updateUser(user.id, {
        status: user.status === "active" ? "suspended" : "active"
      });
      await loadUsers();
    } catch (error) {
      alert(error?.response?.data?.message || "Status update failed");
    }
  }

  function handleEdit(user) {
    navigate(`/admin/users/${user.id}/edit`);
  }

  function handleAddNew() {
    navigate("/admin/users/new");
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
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
              Monitor account status, plan usage, engagement, personal details, and access state for all Mahi AI users.
            </p>
          </div>

          <button
            onClick={handleAddNew}
            className="rounded-[20px] bg-[#53f5e7] px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
          >
            Add New User
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <UsersStatCard
          title="Total Users"
          value={users.length}
          hint="All registered accounts"
          accent="cyan"
        />
        <UsersStatCard
          title="Active Users"
          value={activeUsers}
          hint="Healthy active accounts"
          accent="green"
        />
        <UsersStatCard
          title="Suspended Users"
          value={suspendedUsers}
          hint="Restricted accounts"
          accent="red"
        />
        <UsersStatCard
          title="Pro & Enterprise"
          value={proEnterpriseUsers}
          hint="High-value subscriptions"
          accent="purple"
        />
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
          {loading ? (
            <div className="py-10 text-center text-sm text-[#8f9a97]">
              Loading users...
            </div>
          ) : (
            <UsersTable
              data={filteredUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </div>
      </section>
    </div>
  );
}