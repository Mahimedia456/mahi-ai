import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVideoStudioJobs } from "../../../api/videoStudio.api";
import { getModeLabel, getRelativeTime, getStatusColor } from "../../../utils/videoStudio";

export default function VideoStudioHistory() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const response = await getVideoStudioJobs({ page: 1, limit: 50 });
        setItems(response?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return (
    <div className="min-h-[calc(100vh-144px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-2xl font-bold uppercase tracking-[-0.06em] text-white">
          Video History
        </h1>
        <p className="mt-3 text-white/35">
          Review previous renders, exports, and generation runs.
        </p>
      </div>

      {loading ? (
        <div className="text-white/50">Loading history...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : items.length === 0 ? (
        <div className="border border-mahi-accent/15 p-6 text-white/40">
          No video jobs yet.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/app/video-studio/results?jobId=${item.id}`)}
              className="w-full border border-mahi-accent/15 p-6 text-left transition-all hover:border-mahi-accent/40"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="theme-heading text-1xl font-bold text-white">
                    {item.title || "Untitled Video Generation"}
                  </h3>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/28">
                    {getModeLabel(item.mode)}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`text-[10px] uppercase tracking-[0.22em] ${getStatusColor(item.status)}`}>
                    {item.status}
                  </p>
                  <p className="mt-2 text-sm text-white/35">
                    {getRelativeTime(item.createdAt)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}