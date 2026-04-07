import { Link } from "react-router-dom";

function StatusBadge({ status }) {
  const classes =
    status === "healthy"
      ? "bg-[#53f5e7]/10 text-[#53f5e7]"
      : status === "disabled"
        ? "bg-red-500/10 text-red-300"
        : "bg-yellow-500/10 text-yellow-300";

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${classes}`}>
      {status}
    </span>
  );
}

export default function MediaBucketsTable({
  data = [],
  onDeactivate,
  onActivate,
  onDelete,
  actionLoadingId,
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-white/5 bg-[#171717]">
            <tr>
              {["Bucket", "Region", "Visibility", "Size", "Files", "Status", "Action"].map((head) => (
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
            {data.map((bucket) => {
              const isLoading = actionLoadingId === bucket.id;

              return (
                <tr key={bucket.id} className="border-b border-white/5 last:border-b-0">
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-white">{bucket.name}</p>
                    <p className="mt-1 text-xs text-[#90a09b]">{bucket.description}</p>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#d2dbd9]">{bucket.region}</td>
                  <td className="px-6 py-5 text-sm text-[#d2dbd9] capitalize">{bucket.visibility}</td>
                  <td className="px-6 py-5 text-sm font-semibold text-white">{bucket.totalSize}</td>
                  <td className="px-6 py-5 text-sm text-[#d2dbd9]">{bucket.fileCount}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={bucket.status} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/admin/storage/buckets/${bucket.id}`}
                        className="rounded-xl bg-[#53f5e7]/10 px-3 py-2 text-xs font-semibold text-[#53f5e7] transition hover:bg-[#53f5e7]/15"
                      >
                        View Bucket
                      </Link>

                      {bucket.isActive ? (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => onDeactivate?.(bucket)}
                          className="rounded-xl bg-yellow-500/10 px-3 py-2 text-xs font-semibold text-yellow-300 disabled:opacity-60"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => onActivate?.(bucket)}
                          className="rounded-xl bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300 disabled:opacity-60"
                        >
                          Activate
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => onDelete?.(bucket)}
                        className="rounded-xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!data.length && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-[#90a09b]">
                  No buckets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}