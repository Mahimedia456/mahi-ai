export default function BlockedWordsSettings() {
  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">Blocked Words</h3>

      <textarea
        className="theme-input mt-5 h-40"
        placeholder="Enter blocked words separated by comma..."
      />
    </div>
  );
}