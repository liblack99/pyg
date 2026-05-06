"use client";

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {Pencil, Plus, Trash2} from "lucide-react";
import type {
  FabricationItemStatus,
  ProjectFabricationItem,
} from "@/app/core/projects/fabrication/dto";
import {FABRICATION_ITEM_STATUSES} from "@/app/core/projects/fabrication/dto";
import {FABRICATION_ITEM_STATUS_LABELS} from "@/app/core/projects/fabrication/constants/status-labels";
import {
  getFabricationItemStatusBadgeClass,
  getFabricationItemStatusLabel,
} from "../ui/project-fabrication.utils";
import {formatDate} from "@/app/utils/formatDate";
import {useProjectFabricationItemFormStore} from "../store/fabricationItemForm.store";
import {ProjectFabricationItemDialog} from "./ProjectFabricationItemDialog";
import {apiDelete} from "@/app/lib/api.client";
import Button from "@/app/components/ui/Button";

type Props = {
  fabricationId: string;
  projectId: string;
  items: ProjectFabricationItem[];
  onReload: () => Promise<void>;
};

export function ProjectFabricationItemsSection({
  projectId,
  fabricationId,
  items,
  onReload,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | FabricationItemStatus
  >("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const itemForm = useProjectFabricationItemFormStore();

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        (item.description ?? "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  function handleCreate() {
    itemForm.openCreate(projectId, fabricationId, {}, onReload);
  }

  function handleEdit(item: ProjectFabricationItem) {
    itemForm.openUpdate(
      item.id,
      projectId,
      fabricationId,
      {
        name: item.name,
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        status: item.status,
        plannedStartAt: item.plannedStartAt,
        plannedEndAt: item.plannedEndAt,
        actualStartAt: item.actualStartAt,
        actualEndAt: item.actualEndAt,
        orderIndex: item.orderIndex,
        notes: item.notes,
      },
      onReload,
    );
  }
  async function handleDelete(itemId: string) {
    const ok = window.confirm("¿Deseas eliminar este item de fabricación?");
    if (!ok) return;

    try {
      setDeletingId(itemId);

      await apiDelete(`/api/projects/fabrication/items/${itemId}`);

      itemForm.close();
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
            Items de fabricación
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Administra las tareas o piezas involucradas en el proceso.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar item..."
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | FabricationItemStatus)
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400">
            <option value="ALL">Todos los estados</option>
            {FABRICATION_ITEM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {FABRICATION_ITEM_STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Añadir item
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="border-b border-slate-200 px-4 py-3">
                Item / descripción
              </th>
              <th className="border-b border-slate-200 px-4 py-3">Unidad</th>
              <th className="border-b border-slate-200 px-4 py-3">Cantidad</th>
              <th className="border-b border-slate-200 px-4 py-3">Estado</th>
              <th className="border-b border-slate-200 px-4 py-3">
                Inicio plan
              </th>
              <th className="border-b border-slate-200 px-4 py-3">Fin plan</th>
              <th className="border-b border-slate-200 px-4 py-3">
                Inicio real
              </th>
              <th className="border-b border-slate-200 px-4 py-3">Fin real</th>
              <th className="border-b border-slate-200 px-4 py-3 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-sm text-slate-500">
                  No hay items de fabricación para mostrar.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="text-sm text-slate-700">
                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    <div className="font-medium text-slate-900">
                      {item.name}
                    </div>
                    {item.description ? (
                      <div className="mt-1 text-xs text-slate-500">
                        {item.description}
                      </div>
                    ) : null}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    {item.unit || "—"}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    {item.quantity || "—"}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    <span
                      className={[
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                        getFabricationItemStatusBadgeClass(item.status),
                      ].join(" ")}>
                      {getFabricationItemStatusLabel(item.status)}
                    </span>
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    {formatDate(item.plannedStartAt)}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    {formatDate(item.plannedEndAt)}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    {formatDate(item.actualStartAt)}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    {formatDate(item.actualEndAt)}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 align-top">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="icono"
                        onClick={() => handleEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="icono"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}>
                        {deletingId === item.id ? (
                          "Eliminando..."
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
        <span>Total items: {items.length}</span>
        <span>Mostrando: {filteredItems.length}</span>
      </div>

      <ProjectFabricationItemDialog />
    </section>
  );
}
