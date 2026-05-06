"use client";

import {useMemo} from "react";
import {FileBadge2, FolderOpen, TimerReset} from "lucide-react";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import {ProjectDocumentMultiTypeSection} from "../../documents/components/ProjectDocumentMultiTypeSection";
import type {ProjectDocumentEntity} from "@/app/core/projects/documents/dto";

type Props = {
  projectId: string;
  projectCode: string;
  documents: ProjectDocumentEntity[];
  onRefresh: () => void | Promise<void>;
};

const FINANCE_SUPPORT_ITEMS = [
  {
    type: "FINANCE_SUPPORT" as const,
    label: "Soportes financieros",
    description:
      "Sube soportes, cuentas de cobro, legalizaciones, evidencias y respaldos financieros del proyecto.",
  },
  {
    type: "PAYMENT_PROOF" as const,
    label: "Comprobantes de pago",
    description:
      "Adjunta comprobantes, pagos registrados, consignaciones y soportes de recaudo.",
  },
];

export function ProjectFinanceSupportsSection({
  projectId,
  projectCode,
  documents,
  onRefresh,
}: Props) {
  const financeDocuments = useMemo(
    () =>
      documents.filter(
        (document) =>
          document.type === "FINANCE_SUPPORT" ||
          document.type === "PAYMENT_PROOF",
      ),
    [documents],
  );

  const availableCount = financeDocuments.filter(
    (document) => document.status === "AVAILABLE",
  ).length;
  const categoriesWithFiles = FINANCE_SUPPORT_ITEMS.filter((item) =>
    financeDocuments.some(
      (document) => document.type === item.type && document.status !== "VOID",
    ),
  ).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          title="Soportes financieros"
          value={financeDocuments.length}
          icon={FolderOpen}
          variant="blue"
          hint={
            <span className="text-slate-500">
              Documentos asociados a finanzas
            </span>
          }
        />

        <DashboardStatCard
          title="Disponibles"
          value={availableCount}
          icon={FileBadge2}
          variant="emerald"
          hint={
            <span className="text-slate-500">
              Soportes listos para consulta
            </span>
          }
        />

        <DashboardStatCard
          title="Categorias con archivos"
          value={categoriesWithFiles}
          icon={TimerReset}
          variant="amber"
          hint={<span className="text-slate-500">Cobertura documental</span>}
        />
      </div>

      <ProjectDocumentMultiTypeSection
        title="Soportes financieros"
        description="Carga multiples soportes y comprobantes sin refrescar toda la pagina, reutilizando el sistema documental actual del proyecto."
        items={FINANCE_SUPPORT_ITEMS}
        documents={financeDocuments}
        projectId={projectId}
        projectCode={projectCode}
        onRefresh={onRefresh}
      />
    </div>
  );
}
