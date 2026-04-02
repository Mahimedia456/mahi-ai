import { Outlet } from "react-router-dom";
import AdminSidebar from "../features/admin/components/AdminSidebar";
import AdminTopbar from "../features/admin/components/AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-[360px] w-[360px] rounded-full bg-[#53f5e7]/[0.04] blur-[120px]" />
        <div className="absolute right-0 top-0 h-[260px] w-[260px] rounded-full bg-[#53f5e7]/[0.03] blur-[120px]" />
      </div>

      <div className="relative flex min-h-screen">
        <AdminSidebar />

        <div className="min-w-0 flex-1 lg:ml-[250px]">
          <AdminTopbar />
          <main className="px-5 pb-8 pt-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}