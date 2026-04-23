import { useEffect, useState } from "react";
import { fetchImageStudioJobs } from "../../../api/imageStudio.api";

export default function ImageStudioHistory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchImageStudioJobs({ limit: 20 })
      .then((data) => setItems(data.items || []))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
          History
        </h1>
        <p className="mt-3 text-white/35">
          Review previous image generations and reopen saved outputs.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-mahi-outlineVariant/25 bg-black/50 p-6 transition-all hover:border-mahi-accent/35"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="theme-heading text-lg font-bold text-white">{item.prompt}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-white/28">
                  {item.style_key}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-mahi-accent">
                  {item.status}
                </p>
                <p className="mt-2 text-sm text-white/35">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!items.length ? (
        <div className="mt-16 text-center text-sm text-white/40">
          No history found.
        </div>
      ) : null}
    </div>
  );
}