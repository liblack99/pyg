import Link from "next/link";
import {Clock3, FileText, FolderOpen, ShieldAlert, ClipboardList, FolderKanban} from "lucide-react";
import type {DashboardActivityItem} from "@/app/core/dashboard/dto";
import {formatDate} from "@/app/utils/formatDate";

type Props = {
  items: DashboardActivityItem[];
};

const iconMap = {
  QUOTATION: FileText,
  PROJECT: FolderKanban,
  DOCUMENT: FolderOpen,
  WARRANTY: ShieldAlert,
  INSTALLATION: ClipboardList,
} as const;

export function DashboardRecentActivitySection({items}: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Actividad reciente
        </h2>
        <p className="text-sm text-slate-500">
          Eventos utiles para retomar el hilo del trabajo sin entrar a cada modulo.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {items.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Todavia no hay actividad reciente para mostrar.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const Icon = iconMap[item.type];

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-start gap-4 rounded-xl border border-transparent px-3 py-3 transition hover:border-slate-200 hover:bg-slate-50">
                  <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatDate(item.occurredAt)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
