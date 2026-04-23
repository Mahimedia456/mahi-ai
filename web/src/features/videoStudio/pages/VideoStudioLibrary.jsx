import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVideoStudioLibrary } from "../../../api/videoStudio.api";

export default function VideoStudioLibrary() {
  const navigate = useNavigate();
  const [libraryItems, setLibraryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLibrary() {
      try {
        setLoading(true);
        const response = await getVideoStudioLibrary({ page: 1, limit: 50 });
        setLibraryItems(response?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to load library.");
      } finally {
        setLoading(false);
      }
    }

    loadLibrary();
  }, []);

  return (
    <div className="min-h-[calc(100vh-144px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-2xl font-bold uppercase tracking-[-0.06em] text-white">
          Team Library
        </h1>
        <p className="mt-3 text-white/35">
          Centralized video prompts, source frames, reusable clips, and team assets.
        </p>
      </div>

      {loading ? (
        <div className="text-white/50">Loading library...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : libraryItems.length === 0 ? (
        <div className="border border-mahi-accent/15 bg-black/40 p-8 text-white/40">
          No library assets yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {libraryItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => item.jobId && navigate(`/app/video-studio/results?jobId=${item.jobId}`)}
              className="border border-mahi-accent/15 bg-black/40 p-8 text-left transition-all hover:border-mahi-accent/40 hover:bg-mahi-accent/[0.03]"
            >
              <div className="mb-4 overflow-hidden border border-mahi-accent/10">
                {item.publicUrl && item.mimeType?.startsWith("image/") ? (
                  <img
                    src={item.publicUrl}
                    alt={item.title || "Library asset"}
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center bg-black text-mahi-accent">
                    ✦
                  </div>
                )}
              </div>

              <h3 className="theme-heading text-1xl font-bold text-white">
                {item.title || "Library Asset"}
              </h3>
              <p className="mt-4 text-sm text-white/35">
                {item.assetType || "asset"}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}