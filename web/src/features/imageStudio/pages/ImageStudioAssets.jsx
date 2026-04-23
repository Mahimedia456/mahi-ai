import { useEffect, useState } from "react";
import { fetchImageStudioAssets } from "../../../api/imageStudio.api";

function prettyBytes(size) {
  if (!size) return "—";

  const units = ["B", "KB", "MB", "GB"];
  let value = size;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  return `${value.toFixed(1)} ${units[unit]}`;
}

export default function ImageStudioAssets() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchImageStudioAssets()
      .then(setAssets)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
          Assets
        </h1>
        <p className="mt-3 text-white/35">
          Manage generation references, seeds, prompts, and uploaded media.
        </p>
      </div>

      <div className="border border-mahi-outlineVariant/30">
        {assets.map((asset, index) => (
          <div
            key={asset.id}
            className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-5 ${
              index !== assets.length - 1 ? "border-b border-mahi-outlineVariant/20" : ""
            }`}
          >
            <div>
              <p className="theme-heading text-lg font-bold text-white">{asset.name}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/28">
                Studio Asset
              </p>
            </div>

            <span className="text-[10px] uppercase tracking-[0.2em] text-mahi-accent">
              {asset.asset_type}
            </span>
            <span className="text-sm text-white/35">{prettyBytes(asset.file_size_bytes)}</span>
          </div>
        ))}
      </div>

      {!assets.length ? (
        <div className="mt-16 text-center text-sm text-white/40">
          No assets available.
        </div>
      ) : null}
    </div>
  );
}