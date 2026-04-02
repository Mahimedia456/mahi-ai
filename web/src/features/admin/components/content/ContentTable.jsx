import { Link } from "react-router-dom";

function TypeBadge({ type }) {
  const label = type === "image" ? "Image" : "Video";
  return (
    <span className="rounded-full bg-[#53f5e7]/10 px-3 py-1 text-[11px] font-semibold text-[#53f5e7]">
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    approved: "bg-[#53f5e7]/10 text-[#53f5e7]",
    reported: "bg-yellow-500/10 text-yellow-300",
    deleted: "bg-red-500/10 text-red-300",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${map[status] || "bg-white/10 text-white"}`}>
      {status}
    </span>
  );
}

export default function ContentTable({ data }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-white/5 bg-[#171717]">
            <tr>
              {["Title", "Type", "User", "Model", "Status", "Created", "Action"].map((head) => (
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
            {data.map((item) => (
              <tr key={item.id} className="border-b border-white/5 last:border-b-0">
                <td className="px-6 py-5">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-[#90a09b]">{item.id}</p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <TypeBadge type={item.type} />
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-white">{item.userName}</p>
                  <p className="mt-1 text-xs text-[#90a09b]">{item.userEmail}</p>
                </td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{item.model}</td>
                <td className="px-6 py-5">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{item.createdAt}</td>
                <td className="px-6 py-5">
                  <Link
                    to={`/admin/content/${item.id}`}
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