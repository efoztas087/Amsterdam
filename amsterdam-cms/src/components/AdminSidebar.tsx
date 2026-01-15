"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function AdminSidebar() {
  const path = usePathname();
  const supabase = createSupabaseBrowser();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Homepage", href: "/admin/Home" },
    { name: "Mensen", href: "/admin/Mensen" },
    { name: "Vacatures", href: "/admin/Vacatures" },
    { name: "Projecten", href: "/admin/Projecten" },
    { name: "Expertise", href: "/admin/Expertise" },
    { name: "Publicaties", href: "/admin/Publicaties" },
  ];

  return (
    <aside className="admin-sidebar">
      {/* NAVIGATIE */}
      <nav className="admin-sidebar-nav">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={path === link.href ? "active" : ""}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* UITLOG KNOP */}
      <button
        onClick={handleLogout}
        className="admin-logout-btn"
      >
        Uitloggen
      </button>
    </aside>
  );
}