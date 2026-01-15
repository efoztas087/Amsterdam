import AdminSidebar from "@/components/AdminSidebar";
import "./admin.css";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔐 Server-side auth check
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();

  // ❌ Niet ingelogd → terug naar login
  if (!data.user) {
    redirect("/admin/login");
  }

  // ✅ Wel ingelogd → admin tonen
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-panel">
        {children}
      </div>
    </div>
  );
}