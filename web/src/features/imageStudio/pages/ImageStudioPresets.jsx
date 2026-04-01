const presets = [
  "Cinematic Noir",
  "Product Editorial",
  "High Contrast Futurism",
  "Neural Portrait",
  "Architecture Precision",
  "Anime Edge",
];

export default function ImageStudioPresets() {
  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
          Presets
        </h1>
        <p className="mt-3 text-white/35">
          Apply reusable generation profiles across your image workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {presets.map((preset) => (
          <button
            key={preset}
            className="border border-mahi-outlineVariant/25 bg-black/40 p-8 text-left transition-all hover:border-mahi-accent/40 hover:bg-mahi-accent/[0.03]"
          >
            <p className="theme-heading text-1xl font-bold text-white">{preset}</p>
            <p className="mt-3 text-sm text-white/35">
              Saved neural style profile ready for execution.
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}