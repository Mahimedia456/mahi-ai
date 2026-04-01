import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-mahi-bg text-mahi-text">
      <Outlet />
    </div>
  );
}