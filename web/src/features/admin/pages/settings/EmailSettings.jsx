export default function EmailSettings() {
  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">Email Settings</h3>

      <p className="mt-3 text-sm text-[#97a3a0]">
        SMTP is currently managed from backend environment variables. Admin panel display can be connected later if needed.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <input className="theme-input" placeholder="SMTP Host" disabled value="Managed in .env" readOnly />
        <input className="theme-input" placeholder="SMTP Port" disabled value="Managed in .env" readOnly />
        <input className="theme-input" placeholder="SMTP User" disabled value="Managed in .env" readOnly />
        <input className="theme-input" placeholder="Mail From" disabled value="Managed in .env" readOnly />
      </div>
    </div>
  );
}