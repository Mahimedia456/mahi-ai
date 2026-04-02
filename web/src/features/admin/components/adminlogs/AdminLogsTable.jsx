export default function LogsTable({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-white/5 bg-[#171717]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-[#86938f]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id || idx} className="border-b border-white/5 last:border-b-0">
                {Object.values(row).map((value, index) => (
                  <td key={index} className="px-6 py-5 text-sm text-[#d2dbd9]">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}