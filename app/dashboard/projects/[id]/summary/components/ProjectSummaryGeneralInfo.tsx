"use client";

import type {ProjectView} from "@/app/core/projects/dto";
import {PROJECT_KIND_LABELS} from "../../../constant/projectStatus";
import {formatDate} from "@/app/utils/formatDate";
import {Client} from "@/app/core/clients/dto";

type Props = {
  project: ProjectView;
  stageLabel: string;
};

export function ProjectSummaryGeneralInfo({project, stageLabel}: Props) {
  const clientName = project?.clientSnapshot?.name ?? "—";
  const projectType = PROJECT_KIND_LABELS[project.kind];
  const responsible = project.responsible || "—";
  const quotationNumber = project?.quotation?.numberQuotation ?? "—";

  const deliveryDate = project.deliveryDoneAt
    ? `Entregado el ${formatDate(project.deliveryDoneAt)}`
    : project.deliveryDueAt
      ? `Estimado para ${formatDate(project.deliveryDueAt)}`
      : "Sin fecha estimada";

  const productionOrderStatus = project.requiresProductionOrder
    ? project.latestProductionOrderId
      ? "Registrada"
      : "Pendiente"
    : "No aplica";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Información general
      </h3>

      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
        <SummaryInfoItem label="Cliente" value={clientName} />
        <SummaryInfoItem
          label="Cotización relacionada"
          value={quotationNumber}
        />
        <SummaryInfoItem label="Responsable" value={responsible} />
        <SummaryInfoItem label="Tipo de proyecto" value={projectType} />
        <SummaryInfoItem
          label="Producción requerida"
          value={project.requiresProductionOrder ? "Sí" : "No"}
        />
        <SummaryInfoItem
          label="Orden de producción"
          value={productionOrderStatus}
        />
        <SummaryInfoItem label="Etapa actual" value={stageLabel} />
        <SummaryInfoItem label="Entrega" value={deliveryDate} />
      </div>
    </section>
  );
}

function SummaryInfoItem({label, value}: {label: string; value: string}) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <span className="block text-sm text-slate-400">{label}</span>
      <span className="mt-1 block text-base font-medium text-slate-900">
        {value}
      </span>
    </div>
  );
}
