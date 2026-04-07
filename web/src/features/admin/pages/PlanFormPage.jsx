import { useEffect, useState } from "react";
import { adminApi } from "../../../api/adminApi";

export default function RefundsPage() {
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminApi.getRefunds();
        setRefunds(res.data.data.refunds || []);
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
          Refunds
        </h1>
      </section>

      <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-5 backdrop-blur-xl overflow-x-auto">
        <table className="min-w-full text-sm text-white">
          <thead>
            <tr className="text-left text-[#93a19e]">
              <th className="py-3">User</th>
              <th className="py-3">Email</th>
              <th className="py-3">Refund</th>
              <th className="py-3">Reason</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((item) => (
              <tr key={item.id} className="border-t border-white/5">
                <td className="py-3">{item.user_name}</td>
                <td className="py-3">{item.email}</td>
                <td className="py-3">{item.refund_amount || 0} {item.currency}</td>
                <td className="py-3">{item.refund_reason || "-"}</td>
                <td className="py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}