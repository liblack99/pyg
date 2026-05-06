"use client";

import {
  CalendarDays,
  ClipboardList,
  Pencil,
  Timer,
  UserCircle2,
} from "lucide-react";
import Button from "@/app/components/ui/Button";
import {formatDate} from "@/app/utils/formatDate";
import type {ProjectInstallationDetail} from "@/app/core/projects/installation/dto";
import {PROJECT_INSTALLATION_STATUS_LABELS} from "@/app/core/projects/installation/constants/status-labels";
import {useInstallationDialogStore} from "../store/useInstallationDialog.store";

type Props = {
  installation: ProjectInstallationDetail;
};

function getStatusClasses(status: ProjectInstallationDetail["status"]) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    case "PAUSED":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}

export function ProjectInstallationOverviewCard({installation}: Props) {
  const {openEdit} = useInstallationDialogStore();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-500">
            <ClipboardList className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Instalación
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold text-slate-900">
              {installation.summary?.trim() || "Fase de instalación en sitio"}
            </h3>

            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                installation.status,
              )}`}>
              {PROJECT_INSTALLATION_STATUS_LABELS[installation.status]}
            </span>
          </div>

          <p className="max-w-3xl text-sm text-slate-500">
            {installation.summary?.trim() ||
              "Aún no hay un resumen general de la instalación."}
          </p>
        </div>

        <Button
          type="button"
          variant="icono"
          title="Editar instalación"
          onClick={() => openEdit(installation)}>
          <Pencil className="h-6 w-6" />
        </Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <UserCircle2 className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Responsable
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {installation.responsible?.trim() || "Sin asignar"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <CalendarDays className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Inicio planificado
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {formatDate(installation.plannedStartAt)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <CalendarDays className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Fin planificado
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {formatDate(installation.plannedEndAt)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Timer className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Inicio real
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {formatDate(installation.actualStartAt)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Timer className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Fin real
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {formatDate(installation.actualEndAt)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Resumen
          </p>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
            {installation.summary?.trim() || "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Notas generales
          </p>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
            {installation.notes?.trim() || "—"}
          </p>
        </div>
      </div>
    </section>
  );
}
