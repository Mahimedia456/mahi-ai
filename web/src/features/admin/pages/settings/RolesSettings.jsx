export default function RolesSettings() {
  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">Admin Roles</h3>

      <div className="mt-6 space-y-3 text-sm text-white">
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>Super Admin</span>
          <span>Full access</span>
        </div>

        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>Moderator</span>
          <span>Content moderation</span>
        </div>

        <div className="flex justify-between">
          <span>Support</span>
          <span>User assistance</span>
        </div>
      </div>
    </div>
  );
}