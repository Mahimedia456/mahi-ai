export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="panel p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-white/45">Users</p>
          <h2 className="mt-4 text-4xl font-bold">2,483</h2>
        </div>
        <div className="panel p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-white/45">Revenue</p>
          <h2 className="mt-4 text-4xl font-bold">$18,240</h2>
        </div>
        <div className="panel p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-white/45">Generations</p>
          <h2 className="mt-4 text-4xl font-bold">14,982</h2>
        </div>
      </div>
    </div>
  );
}