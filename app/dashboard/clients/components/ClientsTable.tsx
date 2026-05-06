// app/dashboard/clients/ClientsTable.tsx
"use client";

import Link from "next/link";
import {useState, useEffect} from "react";
import {
  DataTable,
  type ColumnDef,
} from "@/app/components/data-display/DataTable";
import {useClientDelete} from "../hooks/useClientDeleted";
import Button from "@/app/components/ui/Button";
import {apiGet} from "@/app/lib/api.client";
import {ClientListItem} from "@/app/core/clients/dto";
import {Trash2, Edit} from "lucide-react";
import {User, Phone, Mail, MapPin, Building2} from "lucide-react";

type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

type Props = {
  initialItems: ClientListItem[];
  initialNextCursor: string | null;
  canManage: boolean;
  limit?: number;
  queryString?: string;
};

export default function ClientsTable({
  initialItems,
  initialNextCursor,
  canManage,
  limit = 5,

  queryString = "",
}: Props) {
  const {remove} = useClientDelete();

  const [rows, setRows] = useState<ClientListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  useEffect(() => {
    setRows((prev) => (prev === initialItems ? prev : initialItems));
    setNextCursor(initialNextCursor);
  }, [initialItems, initialNextCursor]);

  const hasMore = Boolean(nextCursor);

  async function onLoadMore() {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);

    const base = queryString ? `&${queryString.replace(/^\?/, "")}` : "";
    const url = `/api/clients?cursor=${encodeURIComponent(nextCursor)}&limit=${limit}${base}`;

    const res = await apiGet<CursorPage<ClientListItem>>(url);

    setRows((prev) => {
      const incoming = Array.isArray(res.items) ? res.items : [];

      const seen = new Set(prev.map((x) => x.id));
      const filteredIncoming = incoming.filter((x) => !seen.has(x.id));

      return [...prev, ...filteredIncoming];
    });

    setNextCursor(res.nextCursor ?? null);
    setIsLoadingMore(false);
  }
  console.log(canManage);

  const columns: ColumnDef<ClientListItem>[] = [
    {
      key: "name",
      header: "Cliente",
      render: (r) => (
        <div className="flex items-center gap-3">
          {/* Avatar con iniciales */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full p-1 bg-blue-100 text-blue-600 font-bold text-xs">
            {r.name?.substring(0, 2).toUpperCase() ?? "CL"}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 leading-none">
              {r.name}
            </span>
            <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Building2 size={12} /> {r.city ?? "Sin ciudad"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "document",
      header: "Identificación",
      render: (r) => (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {r.documentType ?? "NIT/CC"}
          </span>
          <span className="inline-flex items-center  py-1 text-sm font-medium text-slate-70">
            {r.documentNumber}
          </span>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contacto Principal",
      render: (r) => (
        <div className="flex flex-col gap-1.5">
          {r.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="rounded-full bg-emerald-50 p-1">
                <Phone size={14} className="text-emerald-600" />
              </div>
              {r.phone}
            </div>
          )}
          {r.email && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Mail size={14} className="text-slate-400" />
              {r.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "location",
      header: "Ubicación",
      render: (r) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={16} className="text-slate-400" />
          <span className="truncate max-w-[150px]">
            {r.address ?? "No registrada"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-32 text-right",
      render: (r) =>
        canManage ? (
          <div className="flex gap-2">
            <Button variant="icono">
              <Link href={`/dashboard/clients/${r.id}`}>
                <Edit size={18} />
              </Link>
            </Button>

            <Button onClick={() => remove(r.id)} variant="icono">
              <Trash2 size={18} />
            </Button>
          </div>
        ) : (
          <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded">
            Solo lectura
          </span>
        ),
    },
  ];
  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      emptyText="No hay clientes."
      isLoading={false}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      onLoadMore={hasMore ? onLoadMore : undefined}
      footerLeft={<span>Mostrando {rows.length}</span>}
    />
  );
}
