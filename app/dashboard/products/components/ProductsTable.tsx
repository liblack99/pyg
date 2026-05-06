// app/dashboard/products/ProductsTable.tsx
"use client";

import Link from "next/link";
import {useState, useEffect} from "react";
import {
  DataTable,
  type ColumnDef,
} from "@/app/components/data-display/DataTable";
import {useProductDelete} from "../hooks/useProductDelete";
import {apiGet} from "@/app/lib/api.client";
import type {ProductListItem} from "@/app/core/products/dto";
import Button from "@/app/components/ui/Button";
import {Package, ExternalLink, Edit, Trash2} from "lucide-react";
import {moneyCOP} from "@/app/utils/moneyFormatted";

type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

type Props = {
  initialItems: ProductListItem[];
  initialNextCursor: string | null;
  canManage: boolean;
  limit?: number;
  queryString?: string;
};

export default function ProductsTable({
  initialItems,
  initialNextCursor,
  canManage,
  limit = 20,
  queryString = "",
}: Props) {
  const {remove} = useProductDelete();

  const [rows, setRows] = useState<ProductListItem[]>(initialItems);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMore = Boolean(nextCursor);

  useEffect(() => {
    setRows((prev) => (prev === initialItems ? prev : initialItems));
    setNextCursor(initialNextCursor);
  }, [initialItems, initialNextCursor]);

  async function onLoadMore() {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);

    const extra = queryString ? `&${queryString.replace(/^\?/, "")}` : "";
    const url = `/api/products?cursor=${encodeURIComponent(nextCursor)}&limit=${limit}${extra}`;

    try {
      const res = await apiGet<CursorPage<ProductListItem>>(url);

      setRows((prev) => {
        const incoming = Array.isArray(res.items) ? res.items : [];

        const seen = new Set(prev.map((x) => x.id));
        const filteredIncoming = incoming.filter((x) => !seen.has(x.id));

        return [...prev, ...filteredIncoming];
      });
      setNextCursor(res.nextCursor ?? null);
    } finally {
      setIsLoadingMore(false);
    }
  }

  const columns: ColumnDef<ProductListItem>[] = [
    {
      key: "product",
      header: "Producto",
      render: (r) => (
        <div className="flex items-center gap-3">
          {/* Miniatura de imagen o Icono por defecto */}
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <Package size={20} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 leading-tight">
              {r.name}
            </span>
            <span className="text-[11px] font-mono text-blue-600 uppercase tracking-wider mt-1">
              {r.code}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "unitPrice",
      header: "Valor Unitario",
      className: "w-44",
      render: (r) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900">
            {moneyCOP(r.unitPrice)}
          </span>
          <span className="text-sm text-slate-500 uppercase">P.V.P</span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Descripción",
      render: (r) => (
        <p className="text-md text-slate-700 leading-relaxed max-w-xs line-clamp-2">
          {r.description || "Sin descripción disponible"}
        </p>
      ),
    },
    {
      key: "image_link",
      header: "Media",
      className: "w-28",
      render: (r) =>
        r.imageUrl ? (
          <a
            href={r.imageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors">
            <ExternalLink size={12} />
            Ver imagen
          </a>
        ) : (
          <span className="text-[10px] text-slate-400 italic">Sin archivo</span>
        ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-32 text-right",
      render: (r) =>
        canManage ? (
          <div className="flex gap-1">
            <Button variant="icono">
              <Link href={`/dashboard/products/${r.id}`}>
                <Edit size={18} />
              </Link>
            </Button>
            <Button variant="icono" onClick={() => remove(r.id)}>
              <Trash2 size={18} />
            </Button>
          </div>
        ) : (
          <span className="text-[10px] font-medium text-slate-400">
            Lectura
          </span>
        ),
    },
  ];
  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      emptyText="No hay productos."
      isLoading={false}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      onLoadMore={hasMore ? onLoadMore : undefined}
      footerLeft={<span>Mostrando {rows.length}</span>}
      loadMoreText="Cargar más"
      loadingText="Cargando productos..."
    />
  );
}
