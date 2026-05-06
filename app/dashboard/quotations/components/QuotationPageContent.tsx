"use client";
import Modal from "@/app/components/ui/Modal";
import AddQuotationNote from "./AddQuotationNote";
import QuotationInvoiceView from "./QuotationInvoiceView";
import {useQuotationAddNote} from "../[id]/hooks/useQutationAddNote";
import {useQuotationView} from "../hooks/useQuotationView";
import QuotationToolbar from "./QuotationToolbar";
import type {QuotationAdvisorOption} from "./QuotationToolbar";

import type {
  QuotationListItem,
  QuotationListQuery,
} from "@/app/core/quotations/dto";
import QuotationTable from "./QuotationTable";
import ProjectForm from "../../projects/[id]/components/detail/ProjectForm";

type Props = {
  initialItems: QuotationListItem[];
  initialNextCursor: string | null;
  query: QuotationListQuery;
  limit?: number;
  advisors: QuotationAdvisorOption[];
};

import {useProjectForm} from "../../projects/hooks/useProjectForm";

export default function QuotationPageContent({
  initialItems,
  initialNextCursor,
  query,
  limit,
  advisors,
}: Props) {
  const view = useQuotationView();
  const note = useQuotationAddNote();

  const projectForm = useProjectForm();

  return (
    <>
      <div className=" flex flex-col gap-6 bg-white pt-6 rounded-xl shadow-sm overflow-hidden ">
        <QuotationToolbar advisors={advisors} />
        <QuotationTable
          initialItems={initialItems}
          initialNextCursor={initialNextCursor}
          query={query}
          limit={limit}
        />
      </div>

      <Modal
        open={view.open}
        title={
          view.quotation?.numberQuotation
            ? `Cotización ${view.quotation.numberQuotation}`
            : "Cotización"
        }
        onClose={view.close}
        footer={
          <div className="flex justify-end gap-2">
            <button className="ui-btn-secondary" onClick={() => window.print()}>
              Imprimir
            </button>
            <button className="ui-btn-secondary" onClick={view.close}>
              Cerrar
            </button>
          </div>
        }>
        {view.isLoading ? (
          <div className="rounded-xl  p-6 text-sm text-slate-500 dark:border-slate-700">
            Cargando cotización...
          </div>
        ) : view.error ? (
          <div className="rounded-xl border p-6 text-sm text-red-600 dark:border-slate-700">
            {view.error}
            <div className="mt-3">
              <button className="ui-btn-secondary" onClick={view.reload}>
                Reintentar
              </button>
            </div>
          </div>
        ) : view.quotation ? (
          <QuotationInvoiceView q={view.quotation} />
        ) : (
          <div className="rounded-xl border p-6 text-sm text-slate-500 dark:border-slate-700">
            No hay datos.
          </div>
        )}
      </Modal>

      <Modal
        onClose={projectForm.close}
        open={projectForm.open}
        title={
          projectForm.mode === "create" ? "Crear proyecto" : "Editar proyecto"
        }>
        <ProjectForm
          form={projectForm.form}
          submit={projectForm.submit}
          mode={projectForm.mode}
        />
      </Modal>
      <Modal onClose={() => note.close()} open={note.open}>
        <AddQuotationNote
          initialNote={note.initialNote}
          error={note.error}
          isLoading={note.isSaving}
          addNote={note.addNote}
          close={note.close}
        />
      </Modal>
    </>
  );
}
