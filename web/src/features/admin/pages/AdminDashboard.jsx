import {
  Users,
  Image as ImageIcon,
  Video,
  CreditCard,
  Activity,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "84,293",
    change: "+12.5%",
    icon: Users,
  },
  {
    title: "Active Subs",
    value: "12,105",
    change: "+4.2%",
    icon: CreditCard,
  },
  {
    title: "Images Gen",
    value: "1.2M",
    change: "+28.1%",
    icon: ImageIcon,
  },
  {
    title: "Revenue",
    value: "$284,900",
    change: "+15.8%",
    icon: CreditCard,
  },
];

const activity = [
  "Alex Rivera joined the Pro plan.",
  "Video Engine completed batch 842-A.",
  "Sarah Chen generated 24 high-res portraits.",
  "API warning detected in US-East latency.",
  "Marcus Thorne renewed Enterprise license.",
  "Mahi-v2 model deployment completed successfully.",
];

function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="rounded-[24px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#53f5e7]/10 text-[#53f5e7]">
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-[#53f5e7]">
          {change}
          <TrendingUp size={13} />
        </div>
      </div>

      <p className="text-sm text-[#a2afac]">{title}</p>
      <h3
        className="mt-2 text-[40px] font-extrabold tracking-[-0.04em] text-white"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        {value}
      </h3>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 px-7 py-8 backdrop-blur-xl sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
              Dashboard Overview
            </p>
            <h1
              className="mt-3 text-[42px] font-extrabold tracking-[-0.05em] text-white sm:text-[50px]"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Welcome back, Aamir
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-8 text-[#9ea8a5]">
              Monitor users, plans, AI usage, generation activity, and platform
              performance from one clean admin control panel.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-[20px] border border-white/10 bg-white/[0.05] px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]">
              Export Report
            </button>
            <button className="rounded-[20px] bg-[#53f5e7] px-7 py-4 text-sm font-bold text-black transition hover:scale-[1.02]">
              Create Plan
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3
                  className="text-[22px] font-bold tracking-[-0.03em] text-white"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  AI Generation Activity
                </h3>
                <p className="mt-2 text-sm text-[#9ea8a5]">
                  Real-time activity overview for the Mahi ecosystem.
                </p>
              </div>

              <div className="flex gap-2">
                <button className="rounded-xl bg-[#2a2a2a] px-4 py-2 text-xs font-semibold text-white">
                  Daily
                </button>
                <button className="rounded-xl px-4 py-2 text-xs font-semibold text-[#9ea8a5] hover:bg-[#222]">
                  Weekly
                </button>
              </div>
            </div>

            <div className="relative flex h-64 items-end gap-3">
              {[40, 65, 55, 85, 70, 60, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[12px] bg-[#53f5e7]/20"
                  style={{ height: `${h}%` }}
                >
                  <div
                    className={`h-full rounded-t-[12px] ${
                      i === 3 ? "bg-[#53f5e7] shadow-[0_0_18px_rgba(83,245,231,0.28)]" : ""
                    }`}
                  />
                </div>
              ))}

              <div className="absolute -bottom-7 left-0 right-0 flex justify-between px-1 text-[10px] font-bold tracking-[0.18em] text-[#73807d]">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a9794]">
                Daily Active Users
              </p>
              <div className="mt-5 flex items-center gap-4">
                <h4
                  className="text-[42px] font-extrabold tracking-[-0.04em] text-white"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  42.8k
                </h4>
                <div className="rounded-lg bg-[#53f5e7]/10 px-2.5 py-1 text-xs font-bold text-[#53f5e7]">
                  +14%
                </div>
              </div>
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
                <div className="h-full w-[72%] rounded-full bg-[#53f5e7] shadow-[0_0_12px_rgba(83,245,231,0.25)]" />
              </div>
              <p className="mt-3 text-xs text-[#8d9a97]">
                Target: 60k peak daily users
              </p>
            </div>

            <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a9794]">
                Subscription Growth
              </p>
              <div className="mt-5 flex items-center gap-4">
                <h4
                  className="text-[42px] font-extrabold tracking-[-0.04em] text-white"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  12.1k
                </h4>
                <div className="rounded-lg bg-[#53f5e7]/10 px-2.5 py-1 text-xs font-bold text-[#53f5e7]">
                  +8%
                </div>
              </div>

              <div className="mt-5 flex h-12 items-end gap-1">
                {[30, 45, 40, 60, 55, 80].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${
                      i === 5 ? "bg-[#53f5e7]" : "bg-[#2a2a2a]"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <p className="mt-3 text-xs text-[#8d9a97]">
                New renewals: 1,204 today
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/5 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#53f5e7]/10 text-[#53f5e7]">
              <Activity size={18} />
            </div>
            <div>
              <h3
                className="text-[20px] font-bold tracking-[-0.03em] text-white"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                System Activity
              </h3>
            </div>
          </div>

          <div className="space-y-4 p-6">
            {activity.map((item, index) => (
              <div
                key={index}
                className="rounded-[20px] border border-white/5 bg-[#171717] p-4 text-sm leading-7 text-[#c7d0ce]"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 p-4 text-center">
            <button className="text-xs font-bold uppercase tracking-[0.22em] text-[#53f5e7]">
              View All Logs
            </button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[30px] border border-[#53f5e7]/10 bg-gradient-to-br from-[#1b1b1b] to-[#131313] p-8">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#53f5e7]/10 blur-[90px]" />
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#53f5e7]/20 bg-[#53f5e7]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#53f5e7]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#53f5e7]" />
              System Health: Optimal
            </div>

            <h2
              className="text-[28px] font-bold tracking-[-0.03em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Machine Learning Integrity
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#a5b0ad]">
              Neural networks are operating at 99.8% precision. Infrastructure
              load is balanced across 4 clusters. Next scheduled model refinement
              in <span className="font-bold text-white">04:22:12</span>.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="rounded-[20px] border border-white/5 bg-black/20 px-6 py-5 text-center">
              <div
                className="text-[30px] font-extrabold tracking-[-0.03em] text-[#53f5e7]"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                0.12s
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#93a09d]">
                Avg. Latency
              </div>
            </div>

            <div className="rounded-[20px] border border-white/5 bg-black/20 px-6 py-5 text-center">
              <div
                className="text-[30px] font-extrabold tracking-[-0.03em] text-[#53f5e7]"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                99.9%
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#93a09d]">
                Uptime
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}