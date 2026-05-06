"use client";

import LoadingSection from "@/app/components/ui/LoadingSection";
import ErrorSection from "@/app/components/ui/ErrorSection";
import {useProjectFinance} from "../hooks/useProjectFinance";
import {ProjectFinanceSummaryCards} from "./ProjectFinanceSummaryCards";
import {ProjectFinanceHealthSection} from "./ProjectFinanceHealthSection";
import {ProjectFinanceCalculationCard} from "./ProjectFinanceCalculationCard";
import {ProjectFinanceEntriesSection} from "./ProjectFinanceEntriesSection";
import {ProjectFinanceSupportsSection} from "./ProjectFinanceSupportsSection";

type Props = {
  projectId: string;
};

export function ProjectFinance({projectId}: Props) {
  const {loading, error, finance, documents, reloadFinance} =
    useProjectFinance(projectId);

  if (loading) {
    return <LoadingSection message="Cargando finanzas..." />;
  }

  if (error) {
    return <ErrorSection message={error} />;
  }

  if (!finance) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">
          No se encontró información financiera para este proyecto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectFinanceSummaryCards summary={finance.summary} />
      <ProjectFinanceHealthSection summary={finance.summary} />
      <ProjectFinanceCalculationCard summary={finance.summary} />
      <ProjectFinanceEntriesSection
        projectId={projectId}
        entries={finance.entries}
        documents={documents}
        onReload={() => reloadFinance({silent: true})}
      />
      <ProjectFinanceSupportsSection
        projectId={projectId}
        projectCode={finance.summary.projectCode}
        documents={documents}
        onRefresh={() => reloadFinance({silent: true})}
      />
    </div>
  );
}
