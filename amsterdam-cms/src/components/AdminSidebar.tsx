"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const path = usePathname();

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
      <nav>
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
    </aside>
  );
}