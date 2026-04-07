import { useEffect, useState } from "react";
import { adminApi } from "../../../api/adminApi";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminApi.getTransactions();
        setTransactions(res.data.data.transactions || []);
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <h1 className="text-[34px] font-extrabold tracking-[-0.04em] text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Transactions
        </h1>
      </section>

      <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-5 backdrop-blur-xl overflow-x-auto">
        <table className="min-w-full text-sm text-white">
          <thead>
            <tr className="text-left text-[#93a19e]">
              <th className="py-3">User</th>
              <th className="py-3">Email</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Method</th>
              <th className="py-3">Reference</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id} className="border-t border-white/5">
                <td className="py-3">{item.user_name}</td>
                <td className="py-3">{item.email}</td>
                <td className="py-3">{item.amount} {item.currency}</td>
                <td className="py-3">{item.payment_method || "-"}</td>
                <td className="py-3">{item.provider_reference || "-"}</td>
                <td className="py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}