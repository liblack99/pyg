"use client";

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {Download, Eye, Pencil, Plus, Trash2} from "lucide-react";
import Button from "@/app/components/ui/Button";
import {apiDelete} from "@/app/lib/api.client";
import {formatDate} from "@/app/utils/formatDate";
import {moneyCOP} from "@/app/utils/moneyFormatted";
import type {ProjectDocumentEntity} from "@/app/core/projects/documents/dto";
import type {ProjectFinanceEntry} from "@/app/core/projects/finance/dto";
import {
  getFinanceEntryCategoryLabel,
  getFinanceEntryStatusBadgeClass,
  getFinanceEntryStatusLabel,
  getFinanceEntryTypeBadgeClass,
  getFinanceEntryTypeLabel,
} from "../ui/project-finance.utils";
import {buildFinanceEntryDefaults} from "../mappers/project-finance.form";
import {useProjectFinanceEntryFormStore} from "../store/financeEntryForm.store";
import {ProjectFinanceEntryDialog} from "./ProjectFinanceEntryDialog";
import {useProjectDocumentPreviewStore} from "@/app/dashboard/projects/store/projectDocumentView.store";

type Props = {
  projectId: string;
  entries: ProjectFinanceEntry[];
  documents: ProjectDocumentEntity[];
  onReload: () => Promise<void>;
};

export function ProjectFinanceEntriesSection({
  projectId,
  entries,
  documents,
  onReload,
}: Props) {
  const router = useRouter();
  const entryForm = useProjectFinanceEntryFormStore();
  const openPreview = useProjectDocumentPreviewStore((state) => state.openPreview);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return entries;

    return entries.filter((entry) => {
      return (
        entry.description.toLowerCase().includes(term) ||
        getFinanceEntryTypeLabel(entry.type).toLowerCase().includes(term) ||
        getFinanceEntryCategoryLabel(entry.category)
          .toLowerCase()
          .includes(term) ||
        (entry.createdByName ?? "").toLowerCase().includes(term)
      );
    });
  }, [entries, search]);

  function handleCreate() {
    entryForm.openCreate(projectId, documents, {}, onReload);
  }

  function handleEdit(entry: ProjectFinanceEntry) {
    entryForm.openUpdate(
      entry.id,
      projectId,
      documents,
      buildFinanceEntryDefaults(entry),
      onReload,
    );
  }

  async function handleDelete(entryId: string) {
    const ok = window.confirm("¿Deseas anular este movimiento financiero?");
    if (!ok) return;

    try {
      setDeletingId(entryId);
      await apiDelete(`/api/projects/${projectId}/finance/entries/${entryId}`);
      await onReload();
      router.refresh();
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Movimientos financieros
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Registra cobros, pagos, costos extra, ajustes e ingresos que no
            nacen automáticamente del flujo operativo.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar movimiento..."
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400"
          />

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Nuevo movimiento
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="border-b border-slate-200 px-4 py-3">Fecha</th>
              <th className="border-b border-slate-200 px-4 py-3">Tipo</th>
              <th className="border-b border-slate-200 px-4 py-3">Categoría</th>
              <th className="border-b border-slate-200 px-4 py-3">Valor</th>
              <th className="border-b border-slate-200 px-4 py-3">Descripción</th>
              <th className="border-b border-slate-200 px-4 py-3">Soporte</th>
              <th className="border-b border-slate-200 px-4 py-3">Creado por</th>
              <th className="border-b border-slate-200 px-4 py-3">Estado</th>
              <th className="border-b border-slate-200 px-4 py-3 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-sm text-slate-500">
                  No hay movimientos financieros para mostrar.
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => (
                <tr key={entry.id} className="text-sm text-slate-700">
                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    {formatDate(entry.date)}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getFinanceEntryTypeBadgeClass(
                        entry.type,
                      )}`}>
                      {getFinanceEntryTypeLabel(entry.type)}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    {getFinanceEntryCategoryLabel(entry.category)}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 align-top font-semibold text-slate-900">
                    {moneyCOP(entry.amount)}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    <div className="font-medium text-slate-900">
                      {entry.description}
                    </div>
                    {entry.notes ? (
                      <div className="mt-1 text-xs text-slate-500">
                        {entry.notes}
                      </div>
                    ) : null}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    {entry.document ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            entry.document?.storageUrl
                              ? openPreview({
                                  title: entry.document.title,
                                  url: entry.document.storageUrl,
                                  mimeType: "application/pdf",
                                })
                              : null
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                          title="Ver soporte">
                          <Eye className="h-4 w-4" />
                        </button>

                        {entry.document.storageUrl ? (
                          <a
                            href={entry.document.storageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                            title="Descargar soporte">
                            <Download className="h-4 w-4" />
                          </a>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-slate-400">Sin soporte</span>
                    )}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    {entry.createdByName ?? "Sistema"}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getFinanceEntryStatusBadgeClass(
                        entry.status,
                      )}`}>
                      {getFinanceEntryStatusLabel(entry.status)}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="icono"
                        onClick={() => handleEdit(entry)}
                        disabled={entry.status === "VOID"}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="icono"
                        onClick={() => handleDelete(entry.id)}
                        disabled={entry.status === "VOID" || deletingId === entry.id}>
                        {deletingId === entry.id ? (
                          "Anulando..."
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Total movimientos: {entries.length}</span>
        <span>Mostrando: {filteredEntries.length}</span>
      </div>

      <ProjectFinanceEntryDialog />
    </section>
  );
}
