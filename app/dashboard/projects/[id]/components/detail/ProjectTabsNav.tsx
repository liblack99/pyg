"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const TABS = [
  {label: "Resumen", path: ""},
  {label: "Presupuesto", path: "budget"},
  {label: "Compras", path: "purchases"},
  {label: "Fabricación", path: "fabrication"},
  {label: "Instalación", path: "installation"},
  {label: "Finanzas", path: "finance"},
  {label: "Documentos", path: "documents"},
  {label: "Anotaciones", path: "notes"},
  {label: "Garantias", path: "warranty"},
];

export default function ProjectTabsNav({projectId}: {projectId: string}) {
  const pathname = usePathname();

  return (
    <nav className="mb-4 flex border-b border-slate-200 rounded-sm bg-white">
      <div className="flex w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-8 px-1 pl-4">
          {TABS.map((tab) => {
            const href = `/dashboard/projects/${projectId}${
              tab.path ? `/${tab.path}` : ""
            }`;

            const active =
              pathname === href ||
              (tab.path === "" && pathname.endsWith(projectId));

            return (
              <Link
                key={tab.label}
                href={href}
                className={[
                  "border-b-4 pb-4 pt-2 text-sm transition-colors whitespace-nowrap",
                  active
                    ? "border-blue-500 font-semibold text-slate-950"
                    : "border-transparent font-medium text-slate-500 hover:text-blue-500",
                ].join(" ")}>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
