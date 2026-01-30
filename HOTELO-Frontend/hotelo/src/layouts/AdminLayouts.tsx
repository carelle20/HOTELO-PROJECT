import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/SidebarAdmin";
import AdminTopbar from "../components/admin/TopbarAdmin";

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-col flex-1 bg-[#F5F7FB] overflow-y-auto">
        <AdminTopbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
