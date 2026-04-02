export default function UserStorageTable({ data }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-white/5 bg-[#171717]">
            <tr>
              {["User", "Plan", "Storage Used", "Files", "Last Updated"].map((head) => (
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
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-[#90a09b]">{item.email}</p>
                </td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{item.plan}</td>
                <td className="px-6 py-5 text-sm font-semibold text-white">{item.storageUsed}</td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{item.files}</td>
                <td className="px-6 py-5 text-sm text-[#d2dbd9]">{item.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}