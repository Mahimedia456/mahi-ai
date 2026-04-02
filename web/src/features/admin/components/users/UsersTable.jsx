import { Link } from "react-router-dom";

function StatusBadge({ status }) {
  const classes =
    status === "active"
      ? "bg-[#53f5e7]/10 text-[#53f5e7]"
      : "bg-red-500/10 text-red-300";

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${classes}`}>
      {status}
    </span>
  );
}

export default function UsersTable({ data }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-white/5 bg-[#171717]">
            <tr>
              {["User", "Plan", "Status", "Joined", "Last Active", "Usage", "Action"].map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-[#86938f]"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((user) => (
              <tr key={user.id} className="border-b border-white/5 last:border-b-0">
                <td className="px-6 py-5">
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="mt-1 text-xs text-[#90a09b]">{user.email}</p>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{user.plan}</td>
                <td className="px-6 py-5">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{user.joinedAt}</td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{user.lastActive}</td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">
                  {user.creditsUsed}/{user.creditsTotal}
                </td>
                <td className="px-6 py-5">
                  <Link
                    to={`/admin/users/${user.id}`}
                    className="rounded-xl bg-[#53f5e7]/10 px-3 py-2 text-xs font-semibold text-[#53f5e7] transition hover:bg-[#53f5e7]/15"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}