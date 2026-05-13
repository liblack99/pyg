// app/dashboard/users/UsersTable.tsx
"use client";

import Link from "next/link";
import {
  DataTable,
  type ColumnDef,
} from "@/app/components/data-display/DataTable";
import {useUserDelete} from "../hooks/useUserDelete";
import type {UserListItem} from "@/app/core/users/dto";
import Button from "@/app/components/ui/Button";
import {Edit, Trash2} from "lucide-react";

type Props = {
  rows: UserListItem[];
  canManage: boolean;
};

export default function UsersTable({rows, canManage}: Props) {
  const {remove} = useUserDelete();
  const columns: ColumnDef<UserListItem>[] = [
    {
      key: "name",
      header: "Usuario",
      render: (r) => (
        <div className="flex items-center gap-3">
          {/* Avatar generado con iniciales */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-600 border border-indigo-100">
            {r.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "U"}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800 leading-none">
              {r.name ?? "Sin nombre"}
            </span>
            <span className="text-xs text-slate-500 mt-1">{r.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rol de Acceso",
      render: (r) => (
        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600 border border-slate-200 uppercase tracking-wider">
          {r.role.name ?? "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${r.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
          />
          <span
            className={`text-xs font-medium ${r.isActive ? "text-emerald-700" : "text-slate-500"}`}>
            {r.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-28 text-center",
      render: (r) =>
        canManage ? (
          <div className="flex justify-start gap-1">
            <Link
              href={`/dashboard/users/${r.id}`}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Editar usuario">
              <Edit size={18} />
            </Link>
            <button
              onClick={() => remove(r.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Eliminar usuario">
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-tight">
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
      emptyText="No hay usuarios."
    />
  );
}
