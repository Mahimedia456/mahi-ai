export default function ModerationSettings() {
  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">Moderation Policies</h3>

      <div className="mt-6 space-y-4 text-sm text-[#a7b4b1]">
        <label className="flex gap-3">
          <input type="checkbox" />
          Enable automatic moderation
        </label>

        <label className="flex gap-3">
          <input type="checkbox" />
          Flag NSFW prompts
        </label>

        <label className="flex gap-3">
          <input type="checkbox" />
          Require manual review for flagged outputs
        </label>
      </div>
    </div>
  );
}