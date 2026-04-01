import {
  ArrowUpRight,
  ImageIcon,
  MessageSquare,
  PlusSquare,
  Sparkles,
  TerminalSquare,
  Video,
  Database,
} from "lucide-react";

const metrics = [
  {
    icon: MessageSquare,
    value: "1.2K",
    label: "AI Chats",
  },
  {
    icon: ImageIcon,
    value: "842",
    label: "Generations",
  },
  {
    icon: Video,
    value: "124",
    label: "Video Renders",
  },
  {
    icon: Database,
    value: "64%",
    label: "Neural Load",
  },
];

const processes = [
  {
    id: "PROC_098",
    name: "4K_IMAGE_UPSCALING_X8",
    progress: 72,
  },
  {
    id: "PROC_142",
    name: "NEURAL_VIDEO_SYNTHESIS",
    progress: 41,
  },
];

const quickCommands = [
  {
    title: "New Neural Thread",
    shortcut: "CMD+N",
    icon: PlusSquare,
  },
  {
    title: "Upscale Canvas",
    shortcut: "CMD+U",
    icon: Sparkles,
  },
  {
    title: "Open CLI",
    shortcut: "CMD+T",
    icon: TerminalSquare,
  },
];

const projects = [
  {
    title: "Project_VOID_01",
    meta: "Neural Art • 2h ago",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Atlas_Mapping_V2",
    meta: "Data Viz • 5h ago",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Secure_Kernel_Node",
    meta: "DevOps • 12h ago",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
];

const logs = [
  '[14:22:01] Establishing secure handshake with cluster-A...',
  '[14:22:04] SUCCESS: Auth token verified.',
  '[14:23:12] User initiating "PROC_098"... allocating GPU resources.',
  "[14:25:44] Thermal levels: 42°C | Power: 850W",
  "[14:28:10] WARNING: Packet loss detected in node-4.",
  "[14:28:12] Rerouting traffic through secondary nexus...",
];

function SectionLabel({ children }) {
  return (
    <h2 className="app-label mb-6 flex items-center gap-2">
      <span className="h-px w-4 bg-white/25" />
      {children}
    </h2>
  );
}

function MetricCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="group relative">
      <div className="absolute -left-2 -top-2 h-4 w-4 border-l border-t border-mahi-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="flex flex-col">
        <Icon size={20} className="mb-3 text-mahi-accent" strokeWidth={1.8} />
        <span className="theme-heading text-4xl font-bold text-white">
          {item.value}
        </span>
        <span className="app-label mt-2 text-white/28">{item.label}</span>
      </div>
    </div>
  );
}

function ProcessBar({ item }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/70">
        <div className="flex items-center gap-3">
          <span className="font-bold text-mahi-accent">{item.id}</span>
          <span className="text-white/35">{item.name}</span>
        </div>
        <span className="font-bold text-mahi-accent">{item.progress}%</span>
      </div>

      <div className="relative h-px w-full bg-white/15">
        <div
          className="absolute left-0 top-0 h-px bg-mahi-accent shadow-[0_0_10px_rgba(83,245,231,0.8)]"
          style={{ width: `${item.progress}%` }}
        />
      </div>
    </div>
  );
}

function CommandButton({ item }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      className="group flex w-full items-center justify-between border border-mahi-outlineVariant/30 px-4 py-4 text-left transition-all duration-200 hover:border-mahi-accent hover:shadow-[0_0_15px_rgba(83,245,231,0.08)]"
    >
      <div className="flex items-center gap-4">
        <Icon size={18} className="text-mahi-accent" strokeWidth={1.9} />
        <span className="app-mono text-xs uppercase tracking-[0.18em] text-white/75 group-hover:text-white">
          {item.title}
        </span>
      </div>
      <span className="app-label text-white/30">{item.shortcut}</span>
    </button>
  );
}

function ProjectCard({ item }) {
  return (
    <button
      type="button"
      className="group border border-mahi-outlineVariant/30 p-4 text-left transition-all duration-200 hover:border-mahi-accent/50"
    >
      <div className="mb-4 aspect-square overflow-hidden bg-black">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full scale-105 object-cover grayscale opacity-55 transition-all duration-500 group-hover:scale-100 group-hover:grayscale-0 group-hover:opacity-100"
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="app-mono text-xs font-bold uppercase tracking-tight text-white">
            {item.title}
          </h3>
          <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/28">
            {item.meta}
          </p>
        </div>

        <ArrowUpRight
          size={16}
          className="mt-0.5 text-white/35 transition-colors group-hover:text-mahi-accent"
        />
      </div>
    </button>
  );
}

export default function DashboardHome() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <header className="mb-12 flex flex-col gap-6 border-b border-mahi-outlineVariant/30 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse bg-mahi-accent shadow-[0_0_8px_rgba(83,245,231,0.9)]" />
            <span className="app-label text-white/55">System Status: Active</span>
          </div>

          <h1 className="theme-heading text-4xl font-extrabold uppercase tracking-[-0.06em] text-white md:text-7xl">
            MAHI_AI<span className="text-mahi-accent">.</span>DASHBOARD
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/45 md:text-lg">
            Synthetic intelligence orchestration interface. V.2.0.4. Neural
            nodes fully operational across 12 distributed clusters.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button className="border border-mahi-accent px-6 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-mahi-accent transition-all hover:bg-mahi-accent/5">
            Initiate_Prompt
          </button>
          <button className="border border-mahi-outlineVariant/40 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white/60 transition-all hover:border-white/35 hover:text-white">
            Export_Logs
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 space-y-12 lg:col-span-8">
          <section>
            <SectionLabel>Neural Metrics</SectionLabel>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {metrics.map((item) => (
                <MetricCard key={item.label} item={item} />
              ))}
            </div>
          </section>

          <section>
            <SectionLabel>Active Computation</SectionLabel>

            <div className="space-y-8">
              {processes.map((item) => (
                <ProcessBar key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between gap-4">
              <SectionLabel>Recent Artifacts</SectionLabel>
              <button
                type="button"
                className="app-label text-mahi-accent transition-colors hover:text-white"
              >
                View_All_Archives
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {projects.map((item) => (
                <ProjectCard key={item.title} item={item} />
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-12 space-y-12 lg:col-span-4">
          <section>
            <SectionLabel>Quick Command</SectionLabel>

            <div className="space-y-3">
              {quickCommands.map((item) => (
                <CommandButton key={item.title} item={item} />
              ))}
            </div>
          </section>

          <section className="border-l border-mahi-outlineVariant/30 pl-6">
            <SectionLabel>System Console</SectionLabel>

            <div className="space-y-4">
              {logs.map((line) => {
                const time = line.match(/^\[[^\]]+\]/)?.[0] || "";
                const content = line.replace(time, "").trim();
                const isWarning = content.startsWith("WARNING");
                const isSuccess = content.startsWith("SUCCESS");
                const isAccent = content.startsWith("Rerouting");

                return (
                  <div key={line} className="app-terminal-line flex gap-2">
                    <span className="app-terminal-time">{time}</span>
                    <span
                      className={
                        isWarning
                          ? "text-red-300"
                          : isSuccess || isAccent
                          ? "text-mahi-accent"
                          : "text-white/65"
                      }
                    >
                      {content}
                    </span>
                  </div>
                );
              })}

              <div className="mt-8 flex items-center gap-2">
                <span className="app-terminal-time app-mono text-[11px] uppercase tracking-[0.2em]">
                  MAHI_ARCHITECT_OS:
                </span>
                <span className="h-3 w-1.5 animate-pulse bg-mahi-accent" />
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="mt-24 flex flex-col gap-4 border-t border-mahi-outlineVariant/30 pt-8 text-[9px] uppercase tracking-[0.3em] text-white/28 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-6">
          <span>© 2024 SYNTHETIC_NOIR_LABS</span>
          <span>Lat: 37.7749° N, Lon: 122.4194° W</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-mahi-accent" />
            SECURE_CONNECTION_ESTABLISHED
          </span>
          <span className="text-white/38">V.2.0.4_BETA</span>
        </div>
      </footer>
    </div>
  );
}