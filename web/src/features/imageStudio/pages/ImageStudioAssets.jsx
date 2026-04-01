const assets = [
  { name: "Night_City_Seed_01.png", type: "PNG", size: "4.2 MB" },
  { name: "Moodboard_CyberFashion.jpg", type: "JPG", size: "2.1 MB" },
  { name: "Prompt_Vector_Master.txt", type: "TXT", size: "12 KB" },
  { name: "Aesthetic_Reference_Set.zip", type: "ZIP", size: "48 MB" },
];

export default function ImageStudioAssets() {
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
            key={asset.name}
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
              {asset.type}
            </span>
            <span className="text-sm text-white/35">{asset.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}