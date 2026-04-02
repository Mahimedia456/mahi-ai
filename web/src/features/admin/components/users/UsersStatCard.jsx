export default function UsersStatCard({ title, value, hint }) {
  return (
    <div className="rounded-[24px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-5 backdrop-blur-xl">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a9794]">
        {title}
      </p>
      <h3
        className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        {value}
      </h3>
      <p className="mt-2 text-xs text-[#90a09b]">{hint}</p>
    </div>
  );
}