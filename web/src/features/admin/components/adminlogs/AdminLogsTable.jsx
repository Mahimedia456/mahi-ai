function StatusBadge({ value }) {
  const normalized = String(value || "").toLowerCase();

  let classes = "bg-white/10 text-white";

  if (
    normalized === "success" ||
    normalized === "ok" ||
    normalized === "active" ||
    normalized === "completed" ||
    normalized === "resolved"
  ) {
    classes = "bg-[#53f5e7]/10 text-[#53f5e7]";
  } else if (
    normalized === "warning" ||
    normalized === "pending" ||
    normalized === "processing"
  ) {
    classes = "bg-yellow-500/10 text-yellow-300";
  } else if (
    normalized === "failed" ||
    normalized === "error" ||
    normalized === "open" ||
    normalized === "disabled"
  ) {
    classes = "bg-red-500/10 text-red-300";
  }

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${classes}`}>
      {value || "-"}
    </span>
  );
}

function renderCell(column, row) {
  const key = String(column).toLowerCase();

  if (key === "status") {
    return <StatusBadge value={row.status} />;
  }

  if (key === "detail") {
    return (
      <p className="max-w-[280px] truncate text-sm text-[#d2dbd9]" title={row.detail || "-"}>
        {row.detail || "-"}
      </p>
    );
  }

  if (key === "id") {
    return (
      <span className="font-mono text-xs text-[#9aa7a3]">
        {row.id || "-"}
      </span>
    );
  }

  const rowKeyMap = {
    id: "id",
    endpoint: "endpoint",
    method: "method",
    status: "status",
    latency: "latency",
    time: "time",
    detail: "detail",
    severity: "severity",
    source: "source",
    queue: "queue",
    state: "state",
    worker: "worker",
    user: "user",
    action: "action",
    type: "type",
    model: "model",
  };

  const value = row[rowKeyMap[key]];

  return <span className="text-sm text-[#d2dbd9]">{value || "-"}</span>;
}

export default function AdminLogsTable({ columns = [], rows = [] }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-white/5 bg-[#171717]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-[#86938f]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id || index} className="border-b border-white/5 last:border-b-0">
                {columns.map((column) => (
                  <td key={`${row.id || index}-${column}`} className="px-6 py-5 align-top">
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))}

            {!rows.length && (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="px-6 py-10 text-center text-sm text-[#90a09b]"
                >
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}