import SubscriptionStatCard from "../components/subscriptions/SubscriptionStatCard";
import PlansTable from "../components/subscriptions/PlansTable";
import { plans } from "../data/subscriptionsData";

export default function PlansPage() {
  const totalSubscribers = plans.reduce((sum, item) => sum + item.subscribers, 0);

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
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
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SubscriptionStatCard title="Total Plans" value={plans.length} hint="Active subscription tiers" />
        <SubscriptionStatCard title="Subscribers" value={totalSubscribers} hint="Across all paid and free tiers" />
        <SubscriptionStatCard title="Top Plan" value="Creator" hint="Highest subscriber count currently" />
        <SubscriptionStatCard title="Enterprise" value="38" hint="High-value business accounts" />
      </section>

      <PlansTable data={plans} />
    </div>
  );
}