const historyItems = [
  {
    prompt: "Cinematic cyberpunk street with fog and rain reflections",
    status: "Completed",
    date: "2 min ago",
  },
  {
    prompt: "Editorial neon fashion portrait in black glass environment",
    status: "Completed",
    date: "1 hour ago",
  },
  {
    prompt: "Architectural sci-fi hallway with ambient cyan light",
    status: "Queued",
    date: "Yesterday",
  },
];

export default function ImageStudioHistory() {
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
        {historyItems.map((item) => (
          <div
            key={item.prompt}
            className="border border-mahi-outlineVariant/25 bg-black/50 p-6 transition-all hover:border-mahi-accent/35"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="theme-heading text-lg font-bold text-white">
                  {item.prompt}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-white/28">
                  Prompt Vector
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