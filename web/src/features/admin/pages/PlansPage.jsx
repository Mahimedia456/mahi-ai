import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubscriptionStatCard from "../components/subscriptions/SubscriptionStatCard";
import PlansTable from "../components/subscriptions/PlansTable";
import { adminApi } from "../../../api/adminApi";

export default function PlansPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  async function loadPlans() {
    try {
      const res = await adminApi.getPlans();
      setPlans(res.data.data.plans || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  const totalSubscribers = plans.reduce((sum, item) => sum + Number(item.subscribers || 0), 0);
  const topPlan = plans.sort((a, b) => (b.subscribers || 0) - (a.subscribers || 0))[0];

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
              Subscription Management
            </p>
            <h1
              className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Plans
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
              Manage pricing tiers, usage allocation, billing structure, and subscriber volume.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/subscriptions/plans/new")}
            className="rounded-[20px] bg-[#53f5e7] px-5 py-3 text-sm font-bold text-black"
          >
            Add New Plan
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SubscriptionStatCard title="Total Plans" value={plans.length} hint="Active subscription tiers" />
        <SubscriptionStatCard title="Subscribers" value={totalSubscribers} hint="Across all paid and free tiers" />
        <SubscriptionStatCard title="Top Plan" value={topPlan?.name || "-"} hint="Highest subscriber count currently" />
        <SubscriptionStatCard title="Enterprise" value={plans.filter((p) => p.slug === "enterprise").length} hint="Enterprise plan rows" />
      </section>

      <PlansTable data={plans} />
    </div>
  );
}