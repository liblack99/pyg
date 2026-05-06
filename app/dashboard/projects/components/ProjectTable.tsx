"use client";
import {ProjectListItem, ProjectListQuery} from "@/app/core/projects/dto";
import {
  DataTable,
  type ColumnDef,
} from "@/app/components/data-display/DataTable";
import {useState, useEffect} from "react";
import {apiGet} from "@/app/lib/api.client";
import Button from "@/app/components/ui/Button";
import {useRouter} from "next/navigation";
import {moneyCOP} from "@/app/utils/moneyFormatted";
import {formatDate} from "@/app/utils/formatDate";
import {
  Eye,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Package,
  Hammer,
  Layers,
} from "lucide-react";

interface ProjectTableProps {
  initialItems: ProjectListItem[];
  initialNextCursor: string | null;
  query: ProjectListQuery;
  limit?: number;
}
export const PROJECT_KIND_LABELS = {
  SUPPLY_ONLY: "Solo Suministro",
  EXECUTION: "Solo Ejecución",
  MIXED: "Suministro e Instalación",
};

export const PROJECT_STATUS_LABELS = {
  ACTIVE: "Activo",
  PAUSED: "Pausado",
  CLOSED: "Cerrado",
  CANCELLED: "Cancelado",
};

type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};
export default function ProjectTable({
  initialItems,
  initialNextCursor,
  query,
  limit,
}: ProjectTableProps) {
  const [rows, setRows] = useState<ProjectListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMore = Boolean(nextCursor);

  const router = useRouter();

  useEffect(() => {
    setRows((prev) => (prev === initialItems ? prev : initialItems));
    setNextCursor(initialNextCursor);
  }, [initialItems, initialNextCursor]);

  async function onLoadMore() {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const params = new URLSearchParams();

      params.set("cursor", nextCursor);
      params.set("limit", String(limit));

      Object.entries(query).forEach(([key, value]) => {
        if (value && key !== "cursor" && key !== "limit") {
          params.set(key, String(value));
        }
      });

      const url = `/api/projects?${params.toString()}`;
      const res = await apiGet<CursorPage<ProjectListItem>>(url);

      // 3. Actualizar estado evitando duplicados
      setRows((prev) => {
        const incoming = Array.isArray(res.items) ? res.items : [];
        const seenIds = new Set(prev.map((x) => x.id));
        const filtered = incoming.filter((x) => !seenIds.has(x.id));
        return [...prev, ...filtered];
      });

      setNextCursor(res.nextCursor);
    } catch (error) {
      console.error("Error loading more projects:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }

  const columns: ColumnDef<ProjectListItem>[] = [
    {
      key: "code",
      header: "Proyecto",
      render: (p) => (
        <div className="flex flex-col gap-1">
          <span className="font-mono text-sm font-bold text-blue-600">
            {p.code}
          </span>
          <span className="text-sm text-slate-400 flex items-center gap-1">
            <Calendar size={10} /> Creado: {formatDate(p.createdAt)}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (p) => {
        const statusStyles = {
          ACTIVE: "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
          PAUSED: "bg-amber-50 text-amber-700 ring-amber-600/20",
          CLOSED: "bg-slate-50 text-slate-700 ring-slate-600/20",
          CANCELLED: "bg-red-50 text-red-700 ring-red-600/20",
        };

        return (
          <span
            className={`inline-flex gap-2 items-center rounded-full px-2 py-1 text-xs font-medium ${statusStyles[p.status]}`}>
            <span
              className={`h-2 w-2 rounded-full ${statusStyles[p.status].includes("bg-emerald") ? "bg-emerald-500" : statusStyles[p.status].includes("bg-amber") ? "bg-amber-500" : statusStyles[p.status].includes("bg-slate") ? "bg-slate-500" : "bg-red-500"}`}
            />
            {PROJECT_STATUS_LABELS[p.status]}
          </span>
        );
      },
    },
    {
      key: "kind",
      header: "Tipo",
      render: (p) => {
        const icons = {
          SUPPLY_ONLY: <Package size={14} className="text-slate-400" />,
          EXECUTION: <Hammer size={14} className="text-slate-400" />,
          MIXED: <Layers size={14} className="text-slate-400" />,
        };
        return (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {icons[p.kind]}
            <span className="whitespace-nowrap">
              {PROJECT_KIND_LABELS[p.kind]}
            </span>
          </div>
        );
      },
    },
    {
      key: "delivery",
      header: "Entrega Esperada",
      render: (p) => {
        if (!p.deliveryDueAt)
          return <span className="text-slate-400 text-xs">-</span>;

        const isOverdue = p.deliveryDueAt < new Date() && !p.deliveryDoneAt;
        const isDone = !!p.deliveryDoneAt;

        return (
          <div className="flex flex-col">
            <div
              className={`flex items-center gap-1.5 text-sm font-medium ${isOverdue ? "text-red-600" : isDone ? "text-emerald-600" : "text-slate-700"}`}>
              {isOverdue && <AlertTriangle size={14} />}
              {isDone && <CheckCircle2 size={14} />}
              {p.deliveryDueAt.toLocaleDateString()}
            </div>
            <span className="text-[10px] text-slate-400">
              {isDone
                ? `Entregado: ${p.deliveryDoneAt?.toLocaleDateString()}`
                : "Fecha pactada"}
            </span>
          </div>
        );
      },
    },
    {
      key: "budget",
      header: "Presupuesto",

      render: (p) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900">
            {moneyCOP(p.budgetTotal)}
          </span>
          <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${Math.min((p.budgetTotal / p.totalQuotationSinIVA) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-20 text-center",
      render: (p) => (
        <div className="flex">
          <Button
            variant="icono"
            onClick={() => router.push(`/dashboard/projects/${p.id}`)}
            title="Ver detalle del proyecto">
            <Eye size={18} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(p) => p.id}
      emptyText="No hay mas proyectos"
      isLoading={false}
      isLoadingMore={isLoadingMore}
      onLoadMore={hasMore ? onLoadMore : undefined}
      footerLeft={<span>Mostrando {rows.length}</span>}
      loadMoreText="Cargar más"
      loadingText="Cargando proyectos..."
    />
  );
}
