import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserDetailTabs from "../components/users/UserDetailTabs";
import { users } from "../data/usersData";

function Panel({ title, subtitle, children }) {
  return (
    <div className="rounded-[26px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
      <h3
        className="text-[20px] font-bold tracking-[-0.03em] text-white"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        {title}
      </h3>
      {subtitle ? <p className="mt-2 text-sm text-[#93a19e]">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
      <span className="text-sm text-[#93a19e]">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

export default function UserDetailsPage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("profile");

  const user = useMemo(() => users.find((item) => item.id === userId), [userId]);

  if (!user) {
    return (
      <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        User not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link to="/admin/users" className="text-xs font-semibold text-[#53f5e7]">
              ← Back to users
            </Link>
            <h1
              className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              {user.name}
            </h1>
            <p className="mt-2 text-sm text-[#9eaaa7]">
              {user.email} · {user.plan} · {user.status}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white">
              Suspend User
            </button>
            <button className="rounded-2xl bg-[#53f5e7] px-5 py-3 text-sm font-bold text-black">
              Edit User
            </button>
          </div>
        </div>
      </section>

      <UserDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "profile" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Profile Overview" subtitle="Core account information and access state.">
            <DataRow label="Full Name" value={user.name} />
            <DataRow label="Email Address" value={user.email} />
            <DataRow label="Country" value={user.country} />
            <DataRow label="Role" value={user.role} />
            <DataRow label="Status" value={user.status} />
            <DataRow label="Joined" value={user.joinedAt} />
            <DataRow label="Last Active" value={user.lastActive} />
          </Panel>

          <Panel title="Admin Notes" subtitle="Internal reference for support and moderation.">
            <p className="text-sm leading-7 text-[#c8d1cf]">{user.notes}</p>
          </Panel>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Panel title="Current Plan">
            <DataRow label="Plan Name" value={user.plan} />
            <DataRow label="Total Billing" value={user.billingTotal} />
            <DataRow label="Credits Total" value={user.creditsTotal} />
          </Panel>

          <Panel title="Usage Allocation">
            <DataRow label="Credits Used" value={user.creditsUsed} />
            <DataRow label="Remaining Credits" value={user.creditsTotal - user.creditsUsed} />
            <DataRow label="Storage Used" value={user.storageUsed} />
          </Panel>

          <Panel title="Subscription Actions">
            <div className="space-y-3">
              <button className="w-full rounded-2xl bg-[#53f5e7] px-4 py-3 text-sm font-bold text-black">
                Upgrade Plan
              </button>
              <button className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white">
                Pause Subscription
              </button>
            </div>
          </Panel>
        </div>
      )}

      {activeTab === "usage" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Panel title="Images Generated">
            <p className="text-[32px] font-extrabold tracking-[-0.03em] text-white">{user.imagesGenerated}</p>
          </Panel>

          <Panel title="Videos Generated">
            <p className="text-[32px] font-extrabold tracking-[-0.03em] text-white">{user.videosGenerated}</p>
          </Panel>

          <Panel title="Credits Used">
            <p className="text-[32px] font-extrabold tracking-[-0.03em] text-white">
              {user.creditsUsed}/{user.creditsTotal}
            </p>
          </Panel>

          <Panel title="Storage Used">
            <p className="text-[32px] font-extrabold tracking-[-0.03em] text-white">{user.storageUsed}</p>
          </Panel>
        </div>
      )}

      {activeTab === "content" && (
        <Panel title="Generated Content" subtitle="Most recent generated assets by this user.">
          <div className="space-y-3">
            {user.generatedItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#151515] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-[#92a09d]">
                    {item.type} · {item.date}
                  </p>
                </div>

                <button className="rounded-xl bg-[#53f5e7]/10 px-4 py-2 text-xs font-semibold text-[#53f5e7]">
                  View Asset
                </button>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {activeTab === "billing" && (
        <Panel title="Billing History" subtitle="Invoices and transaction history.">
          <div className="space-y-3">
            {user.billingHistory.length === 0 ? (
              <p className="text-sm text-[#93a19e]">No billing history available.</p>
            ) : (
              user.billingHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#151515] p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.invoice}</p>
                    <p className="mt-1 text-xs text-[#92a09d]">{item.date}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">{item.amount}</span>
                    <span className="rounded-full bg-[#53f5e7]/10 px-3 py-1 text-[11px] font-semibold text-[#53f5e7]">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}