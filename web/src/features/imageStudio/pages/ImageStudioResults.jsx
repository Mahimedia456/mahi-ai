import { useEffect, useState } from "react";
import {
  Download,
  Trash2,
  ArrowUpCircle,
  FolderPlus,
  Filter,
} from "lucide-react";
import {
  archiveImageStudioOutput,
  deleteImageStudioOutput,
  fetchImageStudioOutputs,
} from "../../../api/imageStudio.api";

export default function ImageStudioResults() {
  const [tab, setTab] = useState("current");
  const [items, setItems] = useState([]);

  async function load() {
    const data = await fetchImageStudioOutputs({
      archived: tab === "archive",
    });
    setItems(data.items || []);
  }

  useEffect(() => {
    load().catch(console.error);
  }, [tab]);

  async function handleArchive(outputId, archived) {
    await archiveImageStudioOutput(outputId, archived);
    await load();
  }

  async function handleDelete(outputId) {
    await deleteImageStudioOutput(outputId);
    await load();
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black p-8">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
            Results
          </h1>
          <div className="mt-4 flex items-center gap-3 border-b border-mahi-outlineVariant/30 py-2">
            <span className="text-mahi-accent">▸</span>
            <p className="font-mono text-sm tracking-tight text-white/45">
              Generated outputs from Image Studio jobs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex border border-mahi-outlineVariant/30 p-1">
            <button
              onClick={() => setTab("current")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] ${
                tab === "current" ? "bg-[#111111] text-mahi-accent" : "text-white/35"
              }`}
            >
              Current
            </button>
            <button
              onClick={() => setTab("archive")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] ${
                tab === "archive" ? "bg-[#111111] text-mahi-accent" : "text-white/35"
              }`}
            >
              Archive
            </button>
          </div>

          <button className="flex items-center gap-2 border border-mahi-accent px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group relative aspect-[16/10] overflow-hidden border border-mahi-outlineVariant/30"
          >
            <img
              src={item.preview_url || item.public_url}
              alt={`Result ${index + 1}`}
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />

            <div className="absolute inset-0 flex flex-col justify-between bg-black/80 p-6 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleArchive(item.id, !item.is_archived)}
                  className="border border-white/20 p-2 text-white transition-all hover:border-mahi-accent hover:text-mahi-accent"
                >
                  <FolderPlus size={15} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="border border-red-400/20 p-2 text-red-300 transition-all hover:border-red-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={item.public_url}
                  download
                  className="flex flex-1 items-center justify-center gap-2 border border-white py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black"
                >
                  <Download size={14} />
                  Download
                </a>

                <button className="flex flex-1 items-center justify-center gap-2 border border-mahi-accent py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black">
                  <ArrowUpCircle size={14} />
                  {index === 1 ? "Canvas" : "Upscale"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!items.length ? (
        <div className="mt-16 text-center text-sm text-white/40">
          No generated results yet.
        </div>
      ) : null}
    </div>
  );
}