export default function AdminUsersSettings() {
  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">Admin Users</h3>

      <div className="mt-6 space-y-3 text-sm text-white">
        <div className="flex justify-between rounded-xl border border-white/10 bg-[#171717] px-4 py-3">
          <span>Super Admin</span>
          <span className="text-[#53f5e7]">Full Access</span>
        </div>

        <div className="flex justify-between rounded-xl border border-white/10 bg-[#171717] px-4 py-3">
          <span>Moderator Admin</span>
          <span className="text-[#53f5e7]">Moderation Access</span>
        </div>
      </div>

      <button className="theme-btn-primary mt-6">Add Admin</button>
    </div>
  );
}