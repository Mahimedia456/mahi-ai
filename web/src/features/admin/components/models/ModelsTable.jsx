import { Link } from "react-router-dom";

function StatusBadge({ status }) {
  const classes =
    status === "active"
      ? "bg-[#53f5e7]/10 text-[#53f5e7]"
      : status === "paused" || status === "disabled"
        ? "bg-red-500/10 text-red-300"
        : "bg-yellow-500/10 text-yellow-300";

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${classes}`}>
      {status}
    </span>
  );
}

export default function ModelsTable({
  data = [],
  onActivate,
  onPause,
  onDelete,
  actionLoadingId,
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-white/5 bg-[#171717]">
            <tr>
              {["Model", "Type", "Version", "Deployment", "Latency", "Success", "Status", "Action"].map((head) => (
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
            {data.map((model) => {
              const isLoading = actionLoadingId === model.id;

              return (
                <tr key={model.id} className="border-b border-white/5 last:border-b-0">
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-semibold text-white">{model.name}</p>
                      <p className="mt-1 text-xs text-[#90a09b]">{model.provider}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#d2dbd9]">{model.type}</td>
                  <td className="px-6 py-5 text-sm text-[#d2dbd9]">{model.version}</td>
                  <td className="px-6 py-5 text-sm text-[#d2dbd9]">{model.deployment}</td>
                  <td className="px-6 py-5 text-sm text-[#d2dbd9]">{model.avgLatency}</td>
                  <td className="px-6 py-5 text-sm text-[#d2dbd9]">{model.successRate}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={model.status} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/admin/models/${model.id}`}
                        className="rounded-xl bg-[#53f5e7]/10 px-3 py-2 text-xs font-semibold text-[#53f5e7] transition hover:bg-[#53f5e7]/15"
                      >
                        View
                      </Link>

                      {model.status !== "active" ? (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => onActivate?.(model)}
                          className="rounded-xl bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300 disabled:opacity-60"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => onPause?.(model)}
                          className="rounded-xl bg-yellow-500/10 px-3 py-2 text-xs font-semibold text-yellow-300 disabled:opacity-60"
                        >
                          Pause
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => onDelete?.(model)}
                        className="rounded-xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!data.length && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-[#90a09b]">
                  No models found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}