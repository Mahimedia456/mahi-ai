function RefundBadge({ status }) {
  const classes =
    status === "Approved"
      ? "bg-[#53f5e7]/10 text-[#53f5e7]"
      : "bg-yellow-500/10 text-yellow-300";

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${classes}`}>
      {status}
    </span>
  );
}

export default function RefundsTable({ data }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-white/5 bg-[#171717]">
            <tr>
              {["User", "Plan", "Amount", "Reason", "Status", "Date"].map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-[#86938f]"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-white/5 last:border-b-0">
                <td className="px-6 py-5">
                  <p className="text-sm text-white">{item.user}</p>
                  <p className="mt-1 text-xs text-[#90a09b]">{item.email}</p>
                </td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{item.plan}</td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{item.amount}</td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{item.reason}</td>
                <td className="px-6 py-5">
                  <RefundBadge status={item.status} />
                </td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}