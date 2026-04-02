export default function GeneralSettings() {
  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">General Settings</h3>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <input className="theme-input" placeholder="Platform Name" />

        <input className="theme-input" placeholder="Support Email" />

        <input className="theme-input" placeholder="Default Language" />

        <input className="theme-input" placeholder="Timezone" />
      </div>
    </div>
  );
}