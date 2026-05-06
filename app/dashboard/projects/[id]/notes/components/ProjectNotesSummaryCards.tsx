"use client";

import {AlertTriangle, ClipboardList, History, Pin} from "lucide-react";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";

type Props = {
  computed: {
    total: number;
    pinnedCount: number;
    warnings: number;
    lastNoteText: string;
  };
};

export function ProjectNotesSummaryCards({computed}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardStatCard
        title="Notas Totales"
        value={computed.total}
        icon={ClipboardList}
        variant="blue"
        hint={<span className="text-slate-400">Bitácora del proyecto</span>}
      />

      <DashboardStatCard
        title="Atención"
        value={computed.warnings}
        icon={AlertTriangle}
        variant="amber"
        hint={<span className="text-amber-600">Advertencias activas</span>}
      />

      <DashboardStatCard
        title="Fijadas"
        value={computed.pinnedCount}
        icon={Pin}
        variant="indigo"
        hint={<span className="text-indigo-600">Importantes</span>}
      />

      <DashboardStatCard
        title="Última Nota"
        value={computed.lastNoteText || "Sin actividad"}
        icon={History}
        variant="slate"
        className="overflow-hidden text-sm"
        hint={<span className="text-slate-400">Actividad reciente</span>}
      />
    </div>
  );
}
