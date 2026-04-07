export default function ModerationSettings() {
  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">Moderation Settings</h3>

      <div className="mt-6 space-y-4">
        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-sm text-white">
          <span>Enable automatic prompt moderation</span>
          <input type="checkbox" defaultChecked />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-sm text-white">
          <span>Block unsafe output generation</span>
          <input type="checkbox" defaultChecked />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-sm text-white">
          <span>Require manual review for flagged content</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
    </div>
  );
}