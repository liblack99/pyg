import Link from "next/link";
import {
  Briefcase,
  ClipboardList,
  FileText,
  ShieldAlert,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";
import type {DashboardKpi} from "@/app/core/dashboard/dto";
import {DashboardStatCard} from "./DashboardStatCard";

const KPI_ICON_MAP = {
  "quotations-month": FileText,
  "projects-active": Briefcase,
  "projects-risk": TriangleAlert,
  "installations-progress": ClipboardList,
  "warranties-open": ShieldAlert,
  "pending-purchases": ShoppingCart,
} as const;

type Props = {
  items: DashboardKpi[];
};

export function DashboardKpiSection({items}: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">KPIs clave</h2>
        <p className="text-sm text-slate-500">
          Lectura rapida del negocio y de los frentes que requieren seguimiento.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = KPI_ICON_MAP[item.id as keyof typeof KPI_ICON_MAP] ?? Briefcase;

          return (
            <Link key={item.id} href={item.href} className="block">
              <DashboardStatCard
                title={item.title}
                value={item.value}
                icon={Icon}
                variant={item.variant}
                hint={<span className="text-slate-400">{item.hint}</span>}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
