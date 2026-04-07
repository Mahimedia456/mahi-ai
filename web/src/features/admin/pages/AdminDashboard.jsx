import { useEffect, useState } from "react";
import {
  Users,
  Activity,
  TrendingUp,
  MessageSquare,
  CreditCard,
  Bot
} from "lucide-react";
import { adminApi } from "../../../api/adminApi";

function StatCard({ title, value, icon: Icon, accent = "Live" }) {
  return (
    <div className="rounded-[24px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#53f5e7]/10 text-[#53f5e7]">
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-[#53f5e7]">
          {accent}
          <TrendingUp size={13} />
        </div>
      </div>

      <p className="text-sm text-[#a2afac]">{title}</p>
      <h3
        className="mt-2 text-[40px] font-extrabold tracking-[-0.04em] text-white"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        {value ?? 0}
      </h3>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const res = await adminApi.overview();
        setStats(res.data?.data?.stats || {});
        setActivity(res.data?.data?.activity || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users
    },
    {
      title: "Active Users",
      value: stats?.activeUsers ?? 0,
      icon: Activity
    },
    {
      title: "Conversations",
      value: stats?.totalConversations ?? 0,
      icon: MessageSquare
    },
    {
      title: "AI Jobs",
      value: stats?.totalJobs ?? 0,
      icon: Bot
    }
  ];

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
              Welcome back, Admin
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-8 text-[#9ea8a5]">
              Monitor users, plans, AI usage, generation activity, and platform performance from one clean admin control panel.
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
        {cards.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3
                className="text-[22px] font-bold tracking-[-0.03em] text-white"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Platform Summary
              </h3>
              <p className="mt-2 text-sm text-[#9ea8a5]">
                Live metrics loaded from backend.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-[22px] border border-white/5 bg-[#171717] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a9794]">
                Active Plans
              </p>
              <h4
                className="mt-3 text-[38px] font-extrabold tracking-[-0.04em] text-white"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                {stats?.activePlans ?? 0}
              </h4>
            </div>

            <div className="rounded-[22px] border border-white/5 bg-[#171717] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a9794]">
                AI Jobs
              </p>
              <h4
                className="mt-3 text-[38px] font-extrabold tracking-[-0.04em] text-white"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                {stats?.totalJobs ?? 0}
              </h4>
            </div>

            <div className="rounded-[22px] border border-white/5 bg-[#171717] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a9794]">
                Pro & Enterprise Users
              </p>
              <h4
                className="mt-3 text-[38px] font-extrabold tracking-[-0.04em] text-white"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                {stats?.proEnterpriseUsers ?? 0}
              </h4>
            </div>

            <div className="rounded-[22px] border border-white/5 bg-[#171717] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a9794]">
                Status
              </p>
              <h4
                className="mt-3 text-[22px] font-extrabold tracking-[-0.04em] text-[#53f5e7]"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                {loading ? "Loading..." : "Connected"}
              </h4>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/5 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#53f5e7]/10 text-[#53f5e7]">
              <CreditCard size={18} />
            </div>
            <div>
              <h3
                className="text-[20px] font-bold tracking-[-0.03em] text-white"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Recent Activity
              </h3>
            </div>
          </div>

          <div className="space-y-4 p-6">
            {activity.length ? (
              activity.map((item, index) => (
                <div
                  key={item.id || index}
                  className="rounded-[20px] border border-white/5 bg-[#171717] p-4"
                >
                  <p className="text-sm font-semibold text-white">
                    {item.title || "Activity"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#c7d0ce]">
                    {item.description || "-"}
                  </p>
                  <p className="mt-2 text-xs text-[#8a9794]">
                    {item.time ? new Date(item.time).toLocaleString() : "-"}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-white/5 bg-[#171717] p-4 text-sm text-[#c7d0ce]">
                No recent activity available.
              </div>
            )}
          </div>

          <div className="border-t border-white/5 p-4 text-center">
            <button className="text-xs font-bold uppercase tracking-[0.22em] text-[#53f5e7]">
              View All Activity
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}