// app/dashboard/users/[id]/page.tsx
import Link from "next/link";
import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import UserEditForm from "./components/UserEditForm";
import type {UserListItem, RoleRef} from "@/app/core/users/dto";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;

  const me = await fetchServer<Me>("/api/me");

  if (!can(me, "users:manage")) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Editar usuario</h1>
        <p className="text-sm text-red-600">
          No tienes permiso para administrar usuarios.
        </p>
        <Link
          className="inline-block rounded border px-3 py-2 text-sm"
          href="/dashboard/users">
          Volver
        </Link>
      </div>
    );
  }

  const [roles, user] = await Promise.all([
    fetchServer<RoleRef[]>("/api/roles"),
    fetchServer<UserListItem>(`/api/users/${id}`),
  ]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Editar usuario</h1>
          <p className="text-sm text-neutral-600">{user.email}</p>
        </div>

        <Link
          href="/dashboard/users"
          className="rounded border px-3 py-2 text-sm hover:bg-neutral-50">
          Volver
        </Link>
      </div>

      <UserEditForm
        userId={user.id}
        roles={roles}
        defaults={{name: user.name, email: user.email, roleId: user.role.id}}
      />
    </div>
  );
}
