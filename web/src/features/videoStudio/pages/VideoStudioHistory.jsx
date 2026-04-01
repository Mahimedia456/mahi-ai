const items = [
  {
    title: "Cybernetic Street Sequence",
    type: "Text to Video",
    date: "12 min ago",
    status: "Completed",
  },
  {
    title: "Luxury Product Motion Reveal",
    type: "Frame to Video",
    date: "1 hour ago",
    status: "Completed",
  },
  {
    title: "Architectural Drone Flythrough",
    type: "Text to Video",
    date: "Yesterday",
    status: "Queued",
  },
];

export default function VideoStudioHistory() {
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

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="border border-mahi-accent/15 p-6 transition-all hover:border-mahi-accent/40"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="theme-heading text-1xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/28">
                  {item.type}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-mahi-accent">
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