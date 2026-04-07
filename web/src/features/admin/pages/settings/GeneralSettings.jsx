export default function GeneralSettings() {
  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">General Settings</h3>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <input className="theme-input" placeholder="Platform Name" defaultValue="Mahi AI" />
        <input className="theme-input" placeholder="Support Email" defaultValue="support@mahi.ai" />
        <input className="theme-input" placeholder="Default Timezone" defaultValue="UTC" />
        <input className="theme-input" placeholder="Brand Accent" defaultValue="#53f5e7" />
      </div>

      <button className="theme-btn-primary mt-6">Save Changes</button>
    </div>
  );
}