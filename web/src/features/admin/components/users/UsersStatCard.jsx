const accentClasses = {
  cyan: {
    badge: "bg-[#53f5e7]/10 text-[#53f5e7] border-[#53f5e7]/20",
    glow: "shadow-[0_0_25px_rgba(83,245,231,0.08)]"
  },
  green: {
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    glow: "shadow-[0_0_25px_rgba(16,185,129,0.08)]"
  },
  red: {
    badge: "bg-red-500/10 text-red-300 border-red-500/20",
    glow: "shadow-[0_0_25px_rgba(239,68,68,0.08)]"
  },
  purple: {
    badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    glow: "shadow-[0_0_25px_rgba(139,92,246,0.08)]"
  }
};

export default function UsersStatCard({
  title,
  value,
  hint,
  accent = "cyan"
}) {
  const style = accentClasses[accent] || accentClasses.cyan;

  return (
    <div
      className={`rounded-[24px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-5 backdrop-blur-xl ${style.glow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a9794]">
            {title}
          </p>
          <h3
            className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            {value}
          </h3>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${style.badge}`}
        >
          Live
        </span>
      </div>

      <p className="mt-2 text-xs leading-6 text-[#90a09b]">{hint}</p>
    </div>
  );
}