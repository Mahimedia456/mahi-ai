import {
  ChevronDown,
  Copy,
  History,
  Image,
  MessageSquare,
  MoreVertical,
  Sparkles,
  Star,
  Video,
} from "lucide-react";

const entries = [
  {
    type: "Image Studio",
    date: "Today at 14:20",
    text: "Cinematic wide shot of a futuristic cyberpunk city shrouded in violet mist, volumetric lighting, 8k resolution, Unreal Engine 5 render...",
    icon: Image,
    active: true,
  },
  {
    type: "Logic Chat",
    date: "Yesterday at 09:45",
    text: "Explain the concept of quantum entanglement using an analogy involving two magic dice that always show the same result...",
    icon: MessageSquare,
    active: false,
  },
  {
    type: "Code Refactor",
    date: "Oct 24 at 16:12",
    text: "Optimize this React component for performance, specifically focusing on memoization and reducing re-renders in the list...",
    icon: Sparkles,
    active: false,
  },
  {
    type: "Motion Flow",
    date: "Oct 22 at 11:30",
    text: "Create a 5-second slow-motion loop of ink drops diffusing in crystal clear water, macro lens, hyper-realistic...",
    icon: Video,
    active: true,
  },
];

export default function PromptHistoryPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-black">
      <header className="sticky top-16 z-20 flex items-center justify-between border-b border-mahi-accent/15 bg-black px-8 py-6">
        <div className="flex items-center gap-4">
          <h2 className="theme-heading text-3xl font-light uppercase tracking-tight text-white">
            Prompt History
          </h2>

          <div className="mx-2 h-4 w-px bg-mahi-accent/20" />

          <div className="flex items-center gap-2 border border-mahi-accent/20 px-3 py-1">
            <span className="h-1.5 w-1.5 bg-mahi-accent" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-mahi-accent">
              Live Sync Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="SEARCH_DATABASE..."
              className="w-64 border border-white/10 bg-black py-1.5 pl-10 pr-4 text-xs text-white placeholder:text-white/20 outline-none transition-all focus:border-mahi-accent/50"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-white/35 transition-colors hover:text-mahi-accent">
              •
              <span className="absolute right-2 top-2 h-1 w-1 bg-mahi-accent" />
            </button>
            <div className="h-8 w-8 border border-white/10 bg-white/5" />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl p-8">
        <div className="mb-10 grid grid-cols-12 gap-6">
          <div className="col-span-12 flex flex-wrap items-center gap-4 lg:col-span-8">
            <div className="flex border border-white/10 p-1">
              {["All", "Chat", "Image", "Edit", "Video"].map((item, index) => (
                <button
                  key={item}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest ${
                    index === 0
                      ? "bg-mahi-accent font-bold text-black"
                      : "text-white/35 hover:text-mahi-accent"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 border border-white/10 px-4 py-2 text-[10px] uppercase tracking-widest text-white/40 transition-colors hover:border-mahi-accent/40">
              <span>Sort: Newest First</span>
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="col-span-12 flex items-center justify-end gap-8 text-right lg:col-span-4">
            <div className="border-l border-white/10 pl-6">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                Total Tokens
              </p>
              <p className="theme-heading text-lg font-bold text-white">1.2M</p>
            </div>

            <div className="border-l border-white/10 pl-6">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                Storage Used
              </p>
              <p className="theme-heading text-lg font-bold text-white">14GB</p>
            </div>
          </div>
        </div>

        <div className="space-y-[1px] border-t border-white/5">
          {entries.map((entry) => {
            const Icon = entry.icon;

            return (
              <div
                key={`${entry.type}-${entry.date}`}
                className="group relative flex items-center justify-between border-b border-white/10 p-6 transition-all duration-300 hover:bg-white/[0.02]"
              >
                <div className="flex flex-1 items-start gap-6">
                  <div
                    className={`mt-1 flex h-10 w-10 items-center justify-center border ${
                      entry.active
                        ? "border-mahi-accent/30 text-mahi-accent"
                        : "border-white/20 text-white/35"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <span
                        className={`border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] ${
                          entry.active
                            ? "border-mahi-accent/20 text-mahi-accent"
                            : "border-white/10 text-white/35"
                        }`}
                      >
                        {entry.type}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-white/25">
                        {entry.date}
                      </span>
                    </div>

                    <h3 className="max-w-3xl truncate text-sm leading-relaxed text-white/75 transition-colors group-hover:text-white">
                      {entry.text}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="p-2 text-white/25 transition-colors hover:text-mahi-accent">
                    <Star size={14} />
                  </button>
                  <button className="p-2 text-white/25 transition-colors hover:text-mahi-accent">
                    <Copy size={14} />
                  </button>
                  <button className="p-2 text-white/25 transition-colors hover:text-mahi-accent">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20">
            Database stream ends
          </p>
          <button className="mt-6 border border-white/10 px-10 py-3 text-[10px] uppercase tracking-[0.3em] text-white/35 transition-all hover:border-mahi-accent hover:text-mahi-accent">
            Load Archive (2023)
          </button>
        </div>
      </section>
    </main>
  );
}