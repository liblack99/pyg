"use client";

import {Clock3, FileText, FolderOpen} from "lucide-react";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";

type Props = {
  summary: {
    totalRequired: number;
    completed: number;
    pending: number;
    completionPct: number;
  };
};

export function ProjectDocumentsSummaryCards({summary}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <DashboardStatCard
        title="Documentos requeridos"
        value={summary.totalRequired}
        icon={FolderOpen}
        variant="blue"
        hint={<span className="text-slate-400">Base documental del proyecto</span>}
      />

      <DashboardStatCard
        title="Disponibles"
        value={summary.completed}
        icon={FileText}
        variant="emerald"
        progress={{
          current: summary.completed,
          total: summary.totalRequired || 1,
        }}
        hint={
          <span className="font-bold text-emerald-600">
            {summary.completionPct}% completado
          </span>
        }
      />

      <DashboardStatCard
        title="Pendientes"
        value={summary.pending}
        icon={Clock3}
        variant="amber"
        hint={<span className="text-amber-600">Por gestionar</span>}
      />
    </div>
  );
}
