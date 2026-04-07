import { Eye, Pencil, Ban, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UsersTable({ data = [], onEdit, onDelete, onToggleStatus }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-[0.22em] text-[#7f8a87]">
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Plan</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Country</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((user) => (
            <tr key={user.id} className="rounded-2xl bg-[#171717] text-sm text-white">
              <td className="rounded-l-2xl px-4 py-4">
                <div className="font-semibold">{user.name}</div>
                <div className="mt-1 text-xs text-[#8d9a97]">{user.email}</div>
              </td>
              <td className="px-4 py-4 text-[#c9d2cf]">{user.plan}</td>
              <td className="px-4 py-4">{user.role}</td>
              <td className="px-4 py-4">{user.status}</td>
              <td className="px-4 py-4">{user.country || "-"}</td>
              <td className="rounded-r-2xl px-4 py-4">
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/admin/users/${user.id}`)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-white"><Eye size={16} /></button>
                  <button onClick={() => onEdit?.(user)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-white"><Pencil size={16} /></button>
                  <button onClick={() => onToggleStatus?.(user)} className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-2 text-yellow-300"><Ban size={16} /></button>
                  <button onClick={() => onDelete?.(user)} className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}