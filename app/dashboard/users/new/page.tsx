// app/dashboard/users/new/page.tsx
import Link from "next/link";
import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import UserCreateForm from "./components/UserCreateForm";
import type {RoleRef} from "@/app/core/users/dto";

export default async function NewUserPage() {
  const me = await fetchServer<Me>("/api/me");

  if (!can(me, "users:manage")) {
    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Crear usuario</h1>
          <p className="text-sm text-red-600">
            No tienes permiso para administrar usuarios.
          </p>
        </div>

        <Link
          href="/dashboard/users"
          className="inline-block rounded border px-3 py-2 text-sm hover:bg-neutral-50">
          Volver
        </Link>
      </div>
    );
  }

  const roles = await fetchServer<RoleRef[]>("/api/roles");

  return (
    <div className="p-6 space-y-4">
      <UserCreateForm roles={roles} />
    </div>
  );
}
