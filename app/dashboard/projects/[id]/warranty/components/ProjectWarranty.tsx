"use client";

import Button from "@/app/components/ui/Button";
import ErrorSection from "@/app/components/ui/ErrorSection";
import LoadingSection from "@/app/components/ui/LoadingSection";
import type {ProjectView} from "@/app/core/projects/dto";
import {WarrantySummaryCards} from "./WarrantySummaryCards";
import {WarrantyCasesTable} from "./WarrantyCasesTable";
import {WarrantyCaseFormDialog} from "./WarrantyCaseFormDialog";
import {WarrantySummaryFormDialog} from "./WarrantySummaryFormDialog";
import {ProjectWarrantyEvidenceSection} from "./ProjectWarrantyEvidenceSection";
import {useProjectWarranty} from "../hooks/useProjectWarranty";

type Props = {
  project: ProjectView;
};

export function ProjectWarranty({project}: Props) {
  const {
    cases,
    suppliers,
    reporters,
    summary,
    loading,
    error,
    savingCase,
    savingSummary,
    summaryOpen,
    caseDialog,
    setSummaryOpen,
    openCreate,
    openEdit,
    closeCaseDialog,
    updateSummary,
    submitCase,
  } = useProjectWarranty(project.id);

  if (loading) {
    return <LoadingSection message="Cargando garantias..." />;
  }

  if (!summary) {
    return (
      <ErrorSection
        title="Garantias"
        message={error ?? "No se encontro informacion de garantias."}
      />
    );
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Garantias</h2>
          <p className="text-sm text-slate-600">
            Administra la vigencia, los casos reportados y el impacto economico.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => setSummaryOpen(true)}>
            Editar garantia
          </Button>
        </div>
      </div>

      <WarrantySummaryFormDialog
        open={summaryOpen}
        summary={summary}
        saving={savingSummary}
        onClose={() => setSummaryOpen(false)}
        onSubmit={updateSummary}
      />

      <WarrantySummaryCards
        summary={summary}
        totalQuotationSinIVA={project.totalQuotationSinIVA}
        budgetTotal={project.budgetTotal}
      />

      <WarrantyCasesTable cases={cases} onCreate={openCreate} onEdit={openEdit} />

      <ProjectWarrantyEvidenceSection
        projectId={project.id}
        projectCode={project.code}
      />

      <WarrantyCaseFormDialog
        open={caseDialog.open}
        mode={caseDialog.mode}
        initialData={caseDialog.selectedCase}
        suppliers={suppliers}
        reporters={reporters}
        saving={savingCase}
        onClose={closeCaseDialog}
        onSubmit={submitCase}
      />
    </div>
  );
}
