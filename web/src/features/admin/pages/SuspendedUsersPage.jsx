import { useEffect, useState } from "react";
import UsersTable from "../components/users/UsersTable";
import { adminApi } from "../../../api/adminApi";

export default function SuspendedUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await adminApi.getUsers({ status: "suspended" });
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
      await adminApi.updateUser(user.id, { status: "active" });
      await loadUsers();
    } catch (error) {
      alert(error?.response?.data?.message || "Status update failed");
    }
  }

  async function handleEdit(user) {
    const fullName = window.prompt("Update full name", user.name);
    if (!fullName) return;

    try {
      await adminApi.updateUser(user.id, { fullName });
      await loadUsers();
    } catch (error) {
      alert(error?.response?.data?.message || "Update failed");
    }
  }

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
          Suspended Users
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Review restricted accounts, moderation hits, and suspended user records.
        </p>
      </section>

      <section className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-5 backdrop-blur-xl">
        {loading ? (
          <div className="py-10 text-center text-sm text-[#8f9a97]">Loading suspended users...</div>
        ) : (
          <UsersTable
            data={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </section>
    </div>
  );
}