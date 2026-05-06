// app/components/DataTable.tsx
"use client";

import React from "react";
import Button from "../ui/Button";

export type ColumnDef<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyText = "No hay registros.",
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  loadMoreText = "Cargar más",
  loadingText = "Cargando...",
  footerLeft,
}: {
  columns: ColumnDef<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyText?: string;

  // Cursor pagination / estados
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;

  loadMoreText?: string;
  loadingText?: string;

  // slot opcional para texto/acciones en footer (ej: "Mostrando 20")
  footerLeft?: React.ReactNode;
}) {
  const showEmpty = !isLoading && rows.length === 0;
  const showLoadingRow = isLoading && rows.length === 0;

  const canLoadMore = Boolean(onLoadMore) && hasMore && !isLoadingMore;

  return (
    <div className="overflow-hidden border-b-0 border-neutral-200 bg-white shadow-sm ">
      <div className="overflow-auto">
        <table className="w-full text-left ">
          <thead className="sticky top-0 z-10 bg-neutral-50 text-left ">
            <tr className="bg-slate-50/50">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={[
                    "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
                    c.className,
                  ].join(" ")}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {showLoadingRow ? (
              <tr className="hover:bg-slate-50/30">
                <td className="px-6 py-4" colSpan={columns.length}>
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-transparent " />
                    <span>{loadingText}</span>
                  </div>
                </td>
              </tr>
            ) : showEmpty ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-sm text-neutral-600"
                  colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={rowKey(r)}
                  className="hover:bg-[#eff2f5] data-[state=selected]:bg-muted  transition-colors">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={[
                        "p-2 align-middle whitespace-nowrap",
                        c.className,
                      ].join(" ")}>
                      {c.render(r)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer opcional para paginación */}
      {(footerLeft || onLoadMore) && (
        <div className="flex flex-col gap-3 border-t border-neutral-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between ">
          <div className="dark:text-neutral-300">{footerLeft}</div>

          {onLoadMore ? (
            <Button
              type="button"
              onClick={onLoadMore}
              disabled={!canLoadMore}
              variant="outline">
              {isLoadingMore
                ? "Cargando..."
                : hasMore
                  ? loadMoreText
                  : "No hay más"}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
