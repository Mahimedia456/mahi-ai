import SubscriptionStatCard from "../components/subscriptions/SubscriptionStatCard";
import RefundsTable from "../components/subscriptions/RefundsTable";
import { refunds } from "../data/subscriptionsData";

export default function RefundsPage() {
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
          Refund Requests
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Review pending and processed refunds across all subscription plans.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <SubscriptionStatCard title="Total Requests" value={refunds.length} hint="Refund requests in current queue" />
        <SubscriptionStatCard title="Pending" value={refunds.filter((i) => i.status === "Pending").length} hint="Awaiting admin decision" />
        <SubscriptionStatCard title="Approved" value={refunds.filter((i) => i.status === "Approved").length} hint="Completed approval actions" />
      </section>

      <RefundsTable data={refunds} />
    </div>
  );
}