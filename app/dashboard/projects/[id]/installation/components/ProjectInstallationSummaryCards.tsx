"use client";

import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HardHat,
  ListChecks,
} from "lucide-react";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import type {ProjectInstallationDetail} from "@/app/core/projects/installation/dto";
import {
  countInstallationItemsByStatus,
  getProjectInstallationStatusLabel,
} from "../ui/project-installation.utils";
import {formatDate} from "@/app/utils/formatDate";

type Props = {
  installation: ProjectInstallationDetail;
};

function getStatusVariant(
  status: ProjectInstallationDetail["status"],
): "blue" | "emerald" | "amber" | "rose" | "indigo" | "slate" {
  switch (status) {
    case "NOT_STARTED":
      return "slate";
    case "IN_PROGRESS":
      return "blue";
    case "PAUSED":
      return "amber";
    case "COMPLETED":
      return "emerald";
    case "CANCELLED":
      return "rose";
    default:
      return "slate";
  }
}

export function ProjectInstallationSummaryCards({installation}: Props) {
  const totalItems = installation.items.length;
  const completedItems = countInstallationItemsByStatus(
    installation.items,
    "COMPLETED",
  );
  const inProgressItems = countInstallationItemsByStatus(
    installation.items,
    "IN_PROGRESS",
  );

  const plannedRange =
    installation.plannedStartAt || installation.plannedEndAt
      ? `${formatDate(installation.plannedStartAt)} · ${formatDate(
          installation.plannedEndAt,
        )}`
      : "Sin fechas estimadas";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        title="Estado general"
        value={getProjectInstallationStatusLabel(installation.status)}
        icon={HardHat}
        variant={getStatusVariant(installation.status)}
        hint={
          <span className="text-slate-500">Fase operativa de instalación</span>
        }
      />

      <DashboardStatCard
        title="Progreso"
        value={`${installation.progressPercent}%`}
        icon={Activity}
        variant="blue"
        hint={
          <span className="text-slate-500">
            Basado en actividades completadas
          </span>
        }
        progress={{
          current: installation.progressPercent,
          total: 100,
        }}
      />

      <DashboardStatCard
        title="Actividades"
        value={totalItems}
        icon={ListChecks}
        variant="emerald"
        hint={
          <div className="flex items-center gap-2 text-slate-500">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {completedItems} completadas
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {inProgressItems} en progreso
            </span>
          </div>
        }
        progress={{
          current: completedItems,
          total: totalItems || 1,
        }}
      />

      <DashboardStatCard
        title="Fechas planificadas"
        value={plannedRange}
        icon={CalendarDays}
        variant="amber"
        hint={
          <span className="text-slate-500">
            Inicio real: {formatDate(installation.actualStartAt)}
          </span>
        }
      />
    </div>
  );
}
