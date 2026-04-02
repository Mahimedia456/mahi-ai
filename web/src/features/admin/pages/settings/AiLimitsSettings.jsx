export default function AiLimitsSettings() {
  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">AI Usage Limits</h3>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <input className="theme-input" placeholder="Images per day" />
        <input className="theme-input" placeholder="Videos per day" />
        <input className="theme-input" placeholder="Prompt tokens limit" />
      </div>
    </div>
  );
}