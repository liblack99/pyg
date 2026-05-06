// app/dashboard/users/UsersTable.tsx
"use client";

import Link from "next/link";
import {DataTable, type ColumnDef} from "@/app/components/data-display/DataTable";
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
      key: "email",
      header: "Email",
      render: (r) => <span className="font-medium">{r.email ?? "-"}</span>,
    },
    {
      key: "name",
      header: "Nombre",
      render: (r) => r.name ?? "-",
    },
    {
      key: "role",
      header: "Rol",
      render: (r) => (
        <span className="rounded bg-neutral-100 px-2 py-1 text-xs">
          {r.role.name ?? "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-40",
      render: (r) =>
        canManage ? (
          <div className="flex gap-2">
            <Button variant="icono">
              <Link href={`/dashboard/users/${r.id}`}>
                <Edit />
              </Link>
            </Button>
            <Button variant="icono" onClick={() => remove(r.id)}>
              <Trash2 />
            </Button>
          </div>
        ) : (
          <span className="text-xs text-neutral-500">Sin acceso</span>
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
