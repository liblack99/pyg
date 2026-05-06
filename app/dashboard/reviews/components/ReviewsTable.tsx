// app/dashboard/reviews/ReviewsTable.tsx
"use client";

import {useState, useEffect} from "react";
import {DataTable, type ColumnDef} from "@/app/components/data-display/DataTable";
import Button from "@/app/components/ui/Button";
import {ReviewDetailsPreview} from "./ReviewDetailsPreview";
import Link from "next/link";
import {useReviewDelete} from "../hooks/useReviewDelete";
import {apiGet} from "@/app/lib/api.client";
import {Review} from "@/app/core/review/dto";
import {Edit, Trash2} from "lucide-react";

type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};
type Props = {
  initialItems: Review[];
  initialNextCursor: string | null;
  canManage: boolean;
  limit?: number;
  queryString?: string;
};

export default function ReviewsTable({
  initialItems,
  initialNextCursor,
  canManage,
  limit = 20,
  queryString = "",
}: Props) {
  const {remove} = useReviewDelete();

  const [rows, setRows] = useState<Review[]>(initialItems);
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
    const url = `/api/reviews?cursor=${encodeURIComponent(nextCursor)}&limit=${limit}${extra}`;

    try {
      const res = await apiGet<CursorPage<Review>>(url);

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

  const columns: ColumnDef<Review>[] = [
    {
      key: "title",
      header: "Título",
      className: "min-w-[240px]",
      render: (r) => (
        <div className="font-medium text-neutral-900 dark:text-neutral-100">
          {r.title}
        </div>
      ),
    },
    {
      key: "details",
      header: "Detalle",
      className: "min-w-[320px]",
      render: (r) => (
        <div className="text-neutral-700 dark:text-neutral-300">
          <ReviewDetailsPreview html={r.details} />
        </div>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-[160px] text-right",
      render: (r) =>
        canManage ? (
          <div className="flex gap-2">
            <Button variant="icono">
              <Link href={`/dashboard/reviews/${r.id}`}>
                <Edit />
              </Link>
            </Button>

            <Button type="button" variant="icono" onClick={() => remove(r.id)}>
              <Trash2 />
            </Button>
          </div>
        ) : (
          <span className="text-xs text-neutral-500">Sin acceso</span>
        ),
    },
  ];

  return (
    <DataTable<Review>
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      emptyText="No hay reseñas."
      isLoading={false}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      onLoadMore={hasMore ? onLoadMore : undefined}
      loadMoreText="Cargar más"
      loadingText="Cargando reseñas..."
      footerLeft={<span>Mostrando {rows.length}</span>}
    />
  );
}
