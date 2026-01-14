import AdminSidebar from "@/components/AdminSidebar";
import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />   {/* 👈 menu links */}
      <div className="admin-panel">
        {children}       {/* 👈 page content rechts */}
      </div>
    </div>
  );
}