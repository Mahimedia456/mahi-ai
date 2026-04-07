import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserDetailTabs from "../components/users/UserDetailTabs";
import { adminApi } from "../../../api/adminApi";

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
      <span className="text-sm font-medium text-white">{value || "-"}</span>
    </div>
  );
}

export default function UserDetailsPage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminApi.getUserById(userId);
        setUser(res.data.data.user);
        setSubscription(res.data.data.subscription);
        setBillingHistory(res.data.data.billingHistory || []);
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, [userId]);

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
              {user.email} · {subscription?.plan_name || "No Plan"} · {user.status}
            </p>
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
            <DataRow label="Date of Birth" value={user.date_of_birth} />
            <DataRow label="Role" value={user.role} />
            <DataRow label="Status" value={user.status} />
            <DataRow label="Joined" value={new Date(user.created_at).toLocaleString()} />
            <DataRow label="Last Active" value={user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "-"} />
          </Panel>

          <Panel title="Admin Notes" subtitle="Internal reference for support and moderation.">
            <p className="text-sm leading-7 text-[#c8d1cf]">{user.notes || "No notes available."}</p>
          </Panel>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Panel title="Current Plan">
            <DataRow label="Plan Name" value={subscription?.plan_name} />
            <DataRow label="Billing Cycle" value={subscription?.billing_cycle} />
            <DataRow label="Status" value={subscription?.status} />
          </Panel>

          <Panel title="Usage Allocation">
            <DataRow label="Chat Credits" value={user.chat_credits_remaining} />
            <DataRow label="Image Credits" value={user.image_credits_remaining} />
            <DataRow label="Video Credits" value={user.video_credits_remaining} />
          </Panel>

          <Panel title="Storage">
            <DataRow label="Storage Used (MB)" value={user.storage_used_mb} />
          </Panel>
        </div>
      )}

      {activeTab === "billing" && (
        <Panel title="Billing History" subtitle="Invoices and transaction history.">
          <div className="space-y-3">
            {billingHistory.length === 0 ? (
              <p className="text-sm text-[#93a19e]">No billing history available.</p>
            ) : (
              billingHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#151515] p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.provider_reference || item.id}</p>
                    <p className="mt-1 text-xs text-[#92a09d]">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">
                      {item.amount} {item.currency}
                    </span>
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