"use client";
// app/components/aside/AsideMenu.tsx

import {usePathname} from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  UserCircle,
  Star,
  Folder,
} from "lucide-react";
import Link from "next/link";
import {useEffect} from "react";

export const asideSections = [
  {
    label: "General",
    items: [
      {
        href: "/dashboard",
        title: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Operación",
    items: [
      {
        href: "/dashboard/projects",
        title: "Proyectos",
        icon: Folder,
      },
      {
        href: "/dashboard/clients",
        title: "Clientes",
        icon: Users,
      },
      {
        href: "/dashboard/products",
        title: "Productos",
        icon: Package,
      },
      {
        href: "/dashboard/quotations",
        title: "Cotizaciones",
        icon: FileText,
      },
      {
        href: "/dashboard/users",
        title: "Usuarios",
        permission: "users:manage",
        icon: UserCircle,
      },
      {
        href: "/dashboard/reviews",
        title: "Reseñas",
        icon: Star,
      },
    ],
  },
];

interface AsideMenuProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

function AsideMenu({mobileOpen = false, onCloseMobile}: AsideMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    onCloseMobile?.();
  }, [pathname, onCloseMobile]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200  lg:static lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Sidebar">
      <div className="p-3 flex items-center gap-3  border-b border-slate-200">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined">
            <Image
              src="/p&g.png"
              alt="Icono de la empresa"
              width={40}
              height={40}
              unoptimized
              className="w-8 h-auto"
            />
          </span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900  leading-none">
            Parque y Grama
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">
            Management v1.0
          </p>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {asideSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 mt-6 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {section.label}
            </p>

            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[#E5F0FB] hover:text-[#0071df]
                    ${
                      isActive
                        ? "bg-[#E5F0FB] text-[#0071df]"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  `}>
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default AsideMenu;
