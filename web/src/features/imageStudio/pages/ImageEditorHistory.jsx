import { useEffect, useState } from "react";
import { getImageEditorJobs } from "../../../api/imageEditorApi";

export default function ImageEditorHistory() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadJobs() {
    try {
      setLoading(true);
      const data = await getImageEditorJobs();
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
            Editor History
          </h1>
          <p className="mt-3 max-w-2xl text-white/35">
            Inspect recent editing operations, exported assets, and transformation steps.
          </p>
        </div>

        <button
          onClick={loadJobs}
          className="border border-mahi-accent px-4 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black"
        >
          Refresh
        </button>
      </div>

      {loading ? <div className="text-white/40">Loading history...</div> : null}

      <div className="space-y-4">
        {jobs.map((item) => (
          <div
            key={item.id}
            className="border border-mahi-accent/15 p-6 transition-all hover:border-mahi-accent/40"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_220px_240px] lg:items-center">
              <div>
                <h3 className="theme-heading text-xl font-bold text-white">
                  {item.tool_type.replaceAll("_", " ")}
                </h3>
                <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-white/28">
                  Job ID: {item.id}
                </p>
                {item.prompt ? (
                  <p className="mt-3 text-sm leading-7 text-white/40">
                    {item.prompt}
                  </p>
                ) : null}
              </div>

              <div className="text-left lg:text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-mahi-accent">
                  {item.status}
                </p>
                <p className="mt-2 text-sm text-white/35">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                {item.output_url ? (
                  <>
                    <a
                      href={item.output_url}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-mahi-accent px-4 py-2 text-xs uppercase tracking-[0.16em] text-mahi-accent"
                    >
                      Output
                    </a>
                    <a
                      href={item.output_url}
                      download
                      className="border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white/70"
                    >
                      Download
                    </a>
                  </>
                ) : null}
              </div>
            </div>

            {item.output_url ? (
              <div className="mt-6 border border-mahi-accent/10 bg-black/30 p-4">
                <img
                  src={item.output_url}
                  alt="Output"
                  className="max-h-[420px] w-full object-contain"
                />
              </div>
            ) : null}

            {item.error_message ? (
              <p className="mt-4 text-sm text-red-400">{item.error_message}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}