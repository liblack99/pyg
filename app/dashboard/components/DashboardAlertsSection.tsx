import Link from "next/link";
import {AlertTriangle, BellRing, ShieldAlert} from "lucide-react";
import type {DashboardAlert, DashboardAlertTone} from "@/app/core/dashboard/dto";

type Props = {
  items: DashboardAlert[];
};

const toneStyles: Record<
  DashboardAlertTone,
  {
    border: string;
    badge: string;
    icon: string;
  }
> = {
  danger: {
    border: "border-rose-200 hover:border-rose-300",
    badge: "bg-rose-50 text-rose-700",
    icon: "text-rose-500",
  },
  warning: {
    border: "border-amber-200 hover:border-amber-300",
    badge: "bg-amber-50 text-amber-700",
    icon: "text-amber-500",
  },
  info: {
    border: "border-sky-200 hover:border-sky-300",
    badge: "bg-sky-50 text-sky-700",
    icon: "text-sky-500",
  },
};

const toneIconMap = {
  danger: AlertTriangle,
  warning: ShieldAlert,
  info: BellRing,
} as const;

export function DashboardAlertsSection({items}: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Alertas operativas
        </h2>
        <p className="text-sm text-slate-500">
          Tarjetas clicables para ir directo a los proyectos que necesitan atencion.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const styles = toneStyles[item.tone];
          const Icon = toneIconMap[item.tone];

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${styles.border}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Alerta
                  </p>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                </div>
                <Icon className={`h-5 w-5 ${styles.icon}`} />
              </div>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-3xl font-bold tracking-tight text-slate-900">
                    {item.count}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${styles.badge}`}>
                  Revisar
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
