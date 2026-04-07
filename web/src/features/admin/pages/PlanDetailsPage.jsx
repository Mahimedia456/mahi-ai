import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlanDetailTabs from "../components/subscriptions/PlanDetailTabs";
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
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

export default function PlanDetailsPage() {
  const { planId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [plan, setPlan] = useState(null);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminApi.getPlanById(planId);
        setPlan(res.data.data.plan);
        setSubscribers(res.data.data.subscribers || []);
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, [planId]);

  if (!plan) {
    return <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-6 text-red-200">Plan not found.</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link to="/admin/subscriptions/plans" className="text-xs font-semibold text-[#53f5e7]">
              ← Back to plans
            </Link>
            <h1
              className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              {plan.name} Plan
            </h1>
            <p className="mt-2 text-sm text-[#9eaaa7]">
              {plan.price_monthly} / month · {plan.is_active ? "active" : "inactive"} · {plan.subscribers} subscribers
            </p>
          </div>
        </div>
      </section>

      <PlanDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Plan Overview" subtitle="Core pricing and plan metadata.">
            <DataRow label="Plan Name" value={plan.name} />
            <DataRow label="Slug" value={plan.slug} />
            <DataRow label="Monthly Price" value={plan.price_monthly} />
            <DataRow label="Yearly Price" value={plan.price_yearly} />
            <DataRow label="Status" value={plan.is_active ? "Active" : "Inactive"} />
            <DataRow label="Subscribers" value={plan.subscribers} />
            <DataRow label="Description" value={plan.description || "-"} />
          </Panel>

          <Panel title="Quick Summary" subtitle="Usage limits and value.">
            <DataRow label="Credits / Month" value={plan.credits_monthly} />
            <DataRow label="Image Limit" value={plan.image_generations_limit} />
            <DataRow label="Video Limit" value={plan.video_generations_limit} />
            <DataRow label="Chat Limit" value={plan.chat_messages_limit} />
            <DataRow label="Upload Limit (MB)" value={plan.max_file_upload_mb} />
          </Panel>
        </div>
      )}

      {activeTab === "features" && (
        <Panel title="Plan Features" subtitle="What this package includes for subscribed users.">
          <div className="space-y-3">
            {(plan.features_json || []).map((feature, index) => (
              <div key={index} className="rounded-2xl border border-white/5 bg-[#151515] p-4 text-sm text-[#d1dad8]">
                {feature}
              </div>
            ))}
          </div>
        </Panel>
      )}

      {activeTab === "subscribers" && (
        <Panel title="Subscribers" subtitle="Accounts currently mapped to this plan.">
          <div className="space-y-3">
            {subscribers.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#151515] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-[#92a09d]">{item.email}</p>
                </div>

                <span className="rounded-full bg-[#53f5e7]/10 px-3 py-1 text-[11px] font-semibold text-[#53f5e7]">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}