// app/dashboard/quotations/components/QuotationTable.tsx
"use client";

import {useState, useEffect} from "react";
import {
  DataTable,
  type ColumnDef,
} from "@/app/components/data-display/DataTable";
import type {
  QuotationListItem,
  QuotationListQuery,
} from "@/app/core/quotations/dto";
import {toQuotationSearchParams} from "@/app/utils/toQuotationSearchParams";
import {apiGet} from "@/app/lib/api.client";
import {Client} from "@/app/core/clients/dto";
import Button from "@/app/components/ui/Button";
import {useQuotationActions} from "../hooks/useQuotationActions";
import QuotationActionsMenu from "./QuotationActionsMenu";
import {StatusBadge} from "@/app/components/ui/StatusBadge";
import {useQuotationView} from "../hooks/useQuotationView";
import {useRouter} from "next/navigation";
import {useQuotationPdfDownload} from "../hooks/useQuotationPdfDownload";
import {useQuotationAddNote} from "../[id]/hooks/useQutationAddNote";
import {Edit, Eye, Notebook, Download, Trash2} from "lucide-react";
import {useProjectForm} from "@/app/dashboard/projects/hooks/useProjectForm";

type Props = {
  initialItems: QuotationListItem[];
  initialNextCursor: string | null;
  query: QuotationListQuery;
  limit?: number;
};

type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

const PROJECT_STATUS_UI: Record<
  "ACTIVE" | "PAUSED" | "CLOSED" | "CANCELLED",
  {label: string; className: string}
> = {
  ACTIVE: {
    label: "Proyecto activo",
    className: "text-blue-700 bg-blue-50 border-blue-100",
  },
  PAUSED: {
    label: "Proyecto pausado",
    className: "text-amber-700 bg-amber-50 border-amber-100",
  },
  CLOSED: {
    label: "Proyecto finalizado",
    className: "text-emerald-700 bg-emerald-50 border-emerald-100",
  },
  CANCELLED: {
    label: "Proyecto cancelado",
    className: "text-red-700 bg-red-50 border-red-100",
  },
};

export default function QuotationTable({
  initialItems,
  initialNextCursor,
  query,
  limit = 5,
}: Props) {
  const [rows, setRows] = useState<QuotationListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const view = useQuotationView();
  const note = useQuotationAddNote();
  const {deleteDraft} = useQuotationActions();
  const projectForm = useProjectForm();
  const {download} = useQuotationPdfDownload();
  const router = useRouter();

  useEffect(() => {
    setRows((prev) => (prev === initialItems ? prev : initialItems));
    setNextCursor(initialNextCursor);
  }, [initialItems, initialNextCursor]);
  const hasMore = Boolean(nextCursor);

  async function onLoadMore() {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);

    const qs = toQuotationSearchParams({
      ...query,
      limit,
      cursor: nextCursor,
    });

    const res = await apiGet<CursorPage<QuotationListItem>>(
      `/api/quotations?${qs.toString()}`,
    );

    setRows((prev) => {
      const incoming = Array.isArray(res.items) ? res.items : [];

      const seen = new Set(prev.map((x) => x.id));
      const filteredIncoming = incoming.filter((x) => !seen.has(x.id));

      return [...prev, ...filteredIncoming];
    });
    setNextCursor(res.nextCursor);
    setIsLoadingMore(false);
  }

  const columns: ColumnDef<QuotationListItem>[] = [
    {
      key: "numberQuotation",
      header: "Cotizacion",
      render: (q) => (
        <div>
          <span className="flex flex-col text-sm font-bold text-blue-500  dark:text-white">
            {q.numberQuotation ?? "—"}
          </span>
          <span>{`${q.projectReference}  ${q.projectReferenceDetail}`}</span>
        </div>
      ),
    },
    {
      key: "client",
      header: "Cliente",
      render: (q) => (q.clientSnapshot as Client).name ?? "Sin cliente",
    },
    {
      key: "date",
      header: "Fecha de creación",
      render: (q) => new Date(q.date).toLocaleDateString(),
    },
    {
      key: "total",
      header: "Total",
      className: "text-right",
      render: (q) => `$${Number(q.totalGeneral).toLocaleString()}`,
    },
    {
      key: "status",
      header: "Estado",
      render: (q) => <StatusBadge status={q.status} />,
    },

    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      render: (q) => (
        <div className="flex gap-2">
          <Button
            variant="icono"
            onClick={() => {
              if (q.status === "DRAFT") {
                router.push(`/dashboard/quotations/${q.id}`); // o /edit
                return;
              }
              const ok = window.confirm(
                "Esta cotización no se puede editar porque no es un BORRADOR.\n\n¿Quieres duplicarla para crear una nueva?",
              );
              if (ok) router.push(`/dashboard/quotations/${q.id}/duplicate`);
            }}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="icono" onClick={() => deleteDraft(q.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="icono"
            onClick={() => view.openById(q.id)}
            title="Ver cotizacion">
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="icono"
            onClick={() => download(q.id)}
            title="Descargar cotizacion">
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="icono"
            onClick={() => note.openById(q.id, q.note)}
            title="Agregar nota">
            <Notebook className="w-4 h-4" />
          </Button>
          <QuotationActionsMenu id={q.id} status={q.status} />
          {q.status === "APPROVED" && (
            <div className="flex items-center">
              {!q.isProject ? (
                /* Si NO es proyecto aún, mostramos el botón */
                <Button
                  variant="outline" // Cambiado a primary para resaltar la acción
                  onClick={() => projectForm.openCreate(q.id)}>
                  Crear proyecto
                </Button>
              ) : (
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full border ${
                    q.projectStatus
                      ? PROJECT_STATUS_UI[q.projectStatus].className
                      : "text-slate-700 bg-slate-100 border-slate-200"
                  }`}>
                  {q.projectStatus
                    ? PROJECT_STATUS_UI[q.projectStatus].label
                    : "Proyecto creado"}
                </span>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "note",
      header: "Notas",
      render: (q) => (
        <span className="px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700">
          {q.note}
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(q) => q.id}
        emptyText="No hay cotizaciones."
        isLoading={false}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={hasMore ? onLoadMore : undefined}
        footerLeft={<span>Mostrando {rows.length}</span>}
        loadMoreText="Cargar más"
        loadingText="Cargando cotizaciones..."
      />
    </>
  );
}
