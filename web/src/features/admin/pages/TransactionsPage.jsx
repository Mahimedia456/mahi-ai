import SubscriptionStatCard from "../components/subscriptions/SubscriptionStatCard";
import TransactionsTable from "../components/subscriptions/TransactionsTable";
import { transactions } from "../data/subscriptionsData";

export default function TransactionsPage() {
  const totalVolume = transactions
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + Number(item.amount.replace("$", "")), 0);

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
          Transactions
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Inspect payment records, invoice state, and billing channel performance.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SubscriptionStatCard title="Total Transactions" value={transactions.length} hint="Current billing records" />
        <SubscriptionStatCard title="Paid" value={transactions.filter((i) => i.status === "Paid").length} hint="Successful renewals and purchases" />
        <SubscriptionStatCard title="Failed" value={transactions.filter((i) => i.status === "Failed").length} hint="Requires billing follow-up" />
        <SubscriptionStatCard title="Volume" value={`$${totalVolume.toFixed(2)}`} hint="Paid billing volume in dataset" />
      </section>

      <TransactionsTable data={transactions} />
    </div>
  );
}