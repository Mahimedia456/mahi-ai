import { useEffect, useMemo, useState } from "react";
import AdminLogsTabs from "../components/adminlogs/AdminLogsTabs.jsx";
import AdminLogsTable from "../components/adminlogs/AdminLogsTable.jsx";
import { fetchAdminLogs } from "../../../api/adminLogsApi.js";

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState("generation");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const { title, subtitle, columns } = useMemo(() => {
    if (activeTab === "api") {
      return {
        title: "API Logs",
        subtitle: "Track endpoint traffic, latency, and service health.",
        columns: ["ID", "Endpoint", "Method", "Status", "Latency", "Time", "Detail"],
      };
    }

    if (activeTab === "errors") {
      return {
        title: "Error Logs",
        subtitle: "Investigate failures, severity, and resolution state.",
        columns: ["ID", "Severity", "Source", "Status", "Time", "Detail"],
      };
    }

    if (activeTab === "queue") {
      return {
        title: "Job Queue Logs",
        subtitle: "Observe queue health, worker state, and processing delays.",
        columns: ["ID", "Queue", "State", "Worker", "Time", "Detail"],
      };
    }

    if (activeTab === "moderation") {
      return {
        title: "Moderation Logs",
        subtitle: "Inspect policy actions, flagged prompts, and review outcomes.",
        columns: ["ID", "User", "Action", "Status", "Time", "Detail"],
      };
    }

    return {
      title: "AI Generation Logs",
      subtitle: "Track image and video generation events across the system.",
      columns: ["ID", "Type", "User", "Model", "Status", "Time", "Detail"],
    };
  }, [activeTab]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchAdminLogs(activeTab);
        setRows(res.items || []);
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activeTab]);

  function exportCsv() {
    if (!rows.length) {
      alert("No logs available to export.");
      return;
    }

    const headerRow = columns.join(",");
    const dataRows = rows.map((row) =>
      columns
        .map((column) => {
          const key = column.toLowerCase();
          const valueMap = {
            id: row.id,
            endpoint: row.endpoint,
            method: row.method,
            status: row.status,
            latency: row.latency,
            time: row.time,
            detail: row.detail,
            severity: row.severity,
            source: row.source,
            queue: row.queue,
            state: row.state,
            worker: row.worker,
            user: row.user,
            action: row.action,
            type: row.type,
            model: row.model,
          };

          const value = valueMap[key] ?? "";
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csv = [headerRow, ...dataRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${activeTab}-logs.csv`;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  if (loading) {
    return <div className="text-sm text-white">Loading logs...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
              Logs
            </p>
            <h1
              className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">{subtitle}</p>
          </div>

          <button
            onClick={exportCsv}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
          >
            Export CSV
          </button>
        </div>
      </section>

      <AdminLogsTabs activeTab={activeTab} onChange={setActiveTab} />
      <AdminLogsTable columns={columns} rows={rows} />
    </div>
  );
}