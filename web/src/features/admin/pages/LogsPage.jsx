import { useMemo, useState } from "react";
import LogsTabs from "../components/logs/LogsTabs";
import LogsTable from "../components/logs/LogsTable";
import {
  apiLogs,
  errorLogs,
  generationLogs,
  jobQueueLogs,
  moderationLogs,
} from "../data/logsData";

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState("generation");

  const { title, subtitle, columns, rows } = useMemo(() => {
    if (activeTab === "api") {
      return {
        title: "API Logs",
        subtitle: "Track endpoint traffic, latency, and service health.",
        columns: ["ID", "Endpoint", "Method", "Status", "Latency", "Time", "Detail"],
        rows: apiLogs.map((item) => ({
          id: item.id,
          endpoint: item.endpoint,
          method: item.method,
          status: item.status,
          latency: item.latency,
          time: item.time,
          detail: item.detail,
        })),
      };
    }

    if (activeTab === "errors") {
      return {
        title: "Error Logs",
        subtitle: "Investigate failures, severity, and resolution state.",
        columns: ["ID", "Severity", "Source", "Status", "Time", "Detail"],
        rows: errorLogs.map((item) => ({
          id: item.id,
          severity: item.severity,
          source: item.source,
          status: item.status,
          time: item.time,
          detail: item.detail,
        })),
      };
    }

    if (activeTab === "queue") {
      return {
        title: "Job Queue Logs",
        subtitle: "Observe queue health, worker state, and processing delays.",
        columns: ["ID", "Queue", "State", "Worker", "Time", "Detail"],
        rows: jobQueueLogs.map((item) => ({
          id: item.id,
          queue: item.queue,
          state: item.state,
          worker: item.worker,
          time: item.time,
          detail: item.detail,
        })),
      };
    }

    if (activeTab === "moderation") {
      return {
        title: "Moderation Logs",
        subtitle: "Inspect policy actions, flagged prompts, and review outcomes.",
        columns: ["ID", "User", "Action", "Status", "Time", "Detail"],
        rows: moderationLogs.map((item) => ({
          id: item.id,
          user: item.user,
          action: item.action,
          status: item.status,
          time: item.time,
          detail: item.detail,
        })),
      };
    }

    return {
      title: "AI Generation Logs",
      subtitle: "Track image and video generation events across the system.",
      columns: ["ID", "Type", "User", "Model", "Status", "Time", "Detail"],
      rows: generationLogs.map((item) => ({
        id: item.id,
        type: item.type,
        user: item.user,
        model: item.model,
        status: item.status,
        time: item.time,
        detail: item.detail,
      })),
    };
  }, [activeTab]);

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
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
      </section>

      <LogsTabs activeTab={activeTab} onChange={setActiveTab} />

      <LogsTable columns={columns} rows={rows} />
    </div>
  );
}