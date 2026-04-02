export default function EmailSettings() {
  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">Email Configuration</h3>

      <div className="mt-6 space-y-4">
        <input className="theme-input" placeholder="SMTP Host" />
        <input className="theme-input" placeholder="SMTP Port" />
        <input className="theme-input" placeholder="SMTP Username" />
        <input className="theme-input" placeholder="SMTP Password" />
      </div>
    </div>
  );
}