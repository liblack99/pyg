"use client";

import {
  Factory,
  ListChecks,
  CalendarDays,
  Activity,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import type {ProjectFabricationDetail} from "@/app/core/projects/fabrication/dto";
import {DashboardStatCard} from "../../../../components/DashboardStatCard";
import {
  countItemsByStatus,
  getProjectFabricationStatusLabel,
} from "../ui/project-fabrication.utils";
import {formatDate} from "@/app/utils/formatDate";

type Props = {
  fabrication: ProjectFabricationDetail;
};

function getStatusVariant(
  status: ProjectFabricationDetail["status"],
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

export function ProjectFabricationSummaryCards({fabrication}: Props) {
  const totalItems = fabrication.items.length;
  const completedItems = countItemsByStatus(fabrication.items, "COMPLETED");
  const inProgressItems = countItemsByStatus(fabrication.items, "IN_PROGRESS");

  const plannedRange =
    fabrication.plannedStartAt || fabrication.plannedEndAt
      ? `${formatDate(fabrication.plannedStartAt)} · ${formatDate(
          fabrication.plannedEndAt,
        )}`
      : "Sin fechas estimadas";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        title="Estado general"
        value={getProjectFabricationStatusLabel(fabrication.status)}
        icon={Factory}
        variant={getStatusVariant(fabrication.status)}
        hint={
          <span className="text-slate-500">Proceso global de fabricación</span>
        }
      />

      <DashboardStatCard
        title="Progreso"
        value={`${fabrication.progressPercent}%`}
        icon={Activity}
        variant="blue"
        hint={
          <span className="text-slate-500">Basado en items completados</span>
        }
        progress={{
          current: fabrication.progressPercent,
          total: 100,
        }}
      />

      <DashboardStatCard
        title="Items de fabricación"
        value={totalItems}
        icon={ListChecks}
        variant="emerald"
        hint={
          <div className="flex items-center gap-2 text-slate-500">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {completedItems} completados
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
            Inicio real: {formatDate(fabrication.actualStartAt)}
          </span>
        }
      />
    </div>
  );
}
