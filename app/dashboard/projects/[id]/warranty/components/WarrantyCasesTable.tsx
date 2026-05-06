"use client";

import {Pencil, Plus} from "lucide-react";
import Button from "@/app/components/ui/Button";
import type {ProjectWarrantyCaseView} from "@/app/core/projects/warranties/dto";
import {
  WARRANTY_CASE_STATUS_LABELS,
  WARRANTY_CASE_TYPE_LABELS,
  WARRANTY_RESPONSIBILITY_LABELS,
} from "../ui/warranty.utils";
import {
  formatCop,
  formatDate,
  getWarrantyCaseStatusBadgeClass,
  getWarrantyCaseTypeBadgeClass,
  getWarrantyResponsibilityBadgeClass,
} from "../ui/warranty.utils";

type Props = {
  cases: ProjectWarrantyCaseView[];
  onCreate: () => void;
  onEdit: (item: ProjectWarrantyCaseView) => void;
};

export function WarrantyCasesTable({cases, onCreate, onEdit}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Casos de garantía
          </h3>
          <p className="text-sm text-slate-500">
            Seguimiento de novedades, responsables, costos y cierre.
          </p>
        </div>

        <Button variant="primary" onClick={onCreate}>
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo caso
          </span>
        </Button>
      </div>

      {cases.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500">
          Aún no hay casos de garantía registrados.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Caso</th>
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">Responsable</th>
                <th className="px-5 py-3 font-medium">Proveedor</th>
                <th className="px-5 py-3 font-medium">Reportado</th>
                <th className="px-5 py-3 font-medium">Resuelto</th>
                <th className="px-5 py-3 font-medium">Costo estimado</th>
                <th className="px-5 py-3 font-medium">Costo real</th>
                <th className="px-5 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {cases.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-5 py-4">
                    <div className="space-y-4 ">
                      <p className="font-medium text-slate-900">{item.title}</p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getWarrantyCaseTypeBadgeClass(
                        item.type,
                      )}`}>
                      {WARRANTY_CASE_TYPE_LABELS[item.type]}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getWarrantyCaseStatusBadgeClass(
                        item.status,
                      )}`}>
                      {WARRANTY_CASE_STATUS_LABELS[item.status]}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getWarrantyResponsibilityBadgeClass(
                        item.responsibility,
                      )}`}>
                      {WARRANTY_RESPONSIBILITY_LABELS[item.responsibility]}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {item.supplierName || "—"}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {formatDate(item.reportedAt)}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {formatDate(item.resolvedAt)}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {formatCop(item.estimatedCost)}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {formatCop(item.realCost)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="icono"
                      title="Editar"
                      onClick={() => onEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
