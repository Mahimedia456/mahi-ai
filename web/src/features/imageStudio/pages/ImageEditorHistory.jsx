const edits = [
  { title: "Background Removed - Campaign_01", date: "12 min ago", status: "Completed" },
  { title: "Object Injection - Shoe Set", date: "1 hour ago", status: "Completed" },
  { title: "4x Upscale - Hero Image", date: "Yesterday", status: "Queued" },
];

export default function ImageEditorHistory() {
  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
          Editor History
        </h1>
        <p className="mt-3 max-w-2xl text-white/35">
          Inspect recent editing operations, exported assets, and transformation steps.
        </p>
      </div>

      <div className="space-y-4">
        {edits.map((item) => (
          <div
            key={item.title}
            className="border border-mahi-accent/15 p-6 transition-all hover:border-mahi-accent/40"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="theme-heading text-x2 font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-white/28">
                  Edit Operation
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-mahi-accent">
                  {item.status}
                </p>
                <p className="mt-2 text-sm text-white/35">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}