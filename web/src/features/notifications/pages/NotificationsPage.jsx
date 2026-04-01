import { Bell, CheckCircle2, CreditCard, Info, Search, Sparkles } from "lucide-react";

const notificationItems = [
  {
    id: 1,
    title: "Render complete",
    type: "Video Studio",
    time: "2 min ago",
    text: "Your Motion Flow export has completed and is ready for download.",
    icon: CheckCircle2,
    active: true,
  },
  {
    id: 2,
    title: "Storage threshold reached",
    type: "System",
    time: "18 min ago",
    text: "Your media library is now using 82% of allocated storage.",
    icon: Info,
    active: false,
  },
  {
    id: 3,
    title: "Billing renewal",
    type: "Billing",
    time: "1 hour ago",
    text: "Your Pro Plan renewal is scheduled in 12 days.",
    icon: CreditCard,
    active: true,
  },
  {
    id: 4,
    title: "Image batch ready",
    type: "Image Studio",
    time: "Today at 09:14",
    text: "The latest generated image batch has been archived to project workspace.",
    icon: Sparkles,
    active: false,
  },
];

export default function NotificationsPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-black">
      <header className="sticky top-16 z-20 flex items-center justify-between border-b border-mahi-accent/15 bg-black px-8 py-6">
        <div className="flex items-center gap-4">
          <h2 className="theme-heading text-3xl font-light uppercase tracking-tight text-white">
            Notifications
          </h2>

          <div className="mx-2 h-4 w-px bg-mahi-accent/20" />

          <div className="flex items-center gap-2 border border-mahi-accent/20 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse bg-mahi-accent" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-mahi-accent">
              Live Feed
            </span>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-mahi-accent" />
          <input
            type="text"
            placeholder="SEARCH_NOTIFICATIONS..."
            className="w-72 border border-white/10 bg-black py-2 pl-10 pr-4 text-xs text-white placeholder:text-white/20 outline-none transition-all focus:border-mahi-accent/50"
          />
        </div>
      </header>

      <section className="mx-auto max-w-6xl p-8">
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="border border-mahi-accent/10 p-6">
            <p className="mb-3 text-[9px] uppercase tracking-[0.3em] text-white/30">
              Total Alerts
            </p>
            <p className="theme-heading text-4xl font-bold text-white">128</p>
          </div>

          <div className="border border-mahi-accent/10 p-6">
            <p className="mb-3 text-[9px] uppercase tracking-[0.3em] text-white/30">
              Unread
            </p>
            <p className="theme-heading text-4xl font-bold text-mahi-accent">06</p>
          </div>

          <div className="border border-mahi-accent/10 p-6">
            <p className="mb-3 text-[9px] uppercase tracking-[0.3em] text-white/30">
              System Status
            </p>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-mahi-accent" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
                Stable
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-[1px] border-t border-white/5">
          {notificationItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group flex items-start justify-between border-b border-white/10 p-6 transition-all hover:bg-white/[0.02]"
              >
                <div className="flex flex-1 items-start gap-5">
                  <div
                    className={`mt-1 flex h-11 w-11 items-center justify-center border ${
                      item.active
                        ? "border-mahi-accent/30 bg-mahi-accent/5 text-mahi-accent"
                        : "border-white/15 text-white/35"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.9} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span
                        className={`border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] ${
                          item.active
                            ? "border-mahi-accent/20 text-mahi-accent"
                            : "border-white/10 text-white/35"
                        }`}
                      >
                        {item.type}
                      </span>

                      <span className="text-[9px] uppercase tracking-widest text-white/25">
                        {item.time}
                      </span>
                    </div>

                    <h3 className="theme-heading text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-white/45">
                      {item.text}
                    </p>
                  </div>
                </div>

                <button className="ml-6 flex h-10 w-10 items-center justify-center border border-white/10 text-white/25 transition-all hover:border-mahi-accent/30 hover:text-mahi-accent">
                  <Bell size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}