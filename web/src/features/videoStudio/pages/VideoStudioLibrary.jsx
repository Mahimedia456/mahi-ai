const libraryItems = [
  { title: "Brand Motion Assets", count: "28 clips" },
  { title: "Product Reveal Frames", count: "14 source frames" },
  { title: "Mood References", count: "52 visuals" },
  { title: "Archived Renders", count: "87 exports" },
];

export default function VideoStudioLibrary() {
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {libraryItems.map((item) => (
          <div
            key={item.title}
            className="border border-mahi-accent/15 bg-black/40 p-8 transition-all hover:border-mahi-accent/40 hover:bg-mahi-accent/[0.03]"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center border border-mahi-accent/20 text-mahi-accent">
              ✦
            </div>
            <h3 className="theme-heading text-1xl font-bold text-white">
              {item.title}
            </h3>
            <p className="mt-4 text-sm text-white/35">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}