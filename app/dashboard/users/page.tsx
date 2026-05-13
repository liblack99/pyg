// app/dashboard/users/page.tsx
import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import UsersTable from "./components/UsersTable";
import {UserListItem} from "@/app/core/users/dto";
import PageHeader from "@/app/components/layout/PageHeader";
import {UserStats} from "./components/UserStats";

export default async function UsersPage() {
  const me = await fetchServer<Me>("/api/me");
  const users = await fetchServer<UserListItem[]>("/api/users");

  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Usuarios"
        subtitle="Gestiona tus usuarios"
        href="/dashboard/users/new"
        textButton="Nuevo usuario"
      />
      <UserStats users={users} />
      <div className=" flex flex-col gap-6 bg-white pt-6 rounded-xl shadow-sm overflow-hidden ">
        <UsersTable rows={users} canManage={can(me, "users:manage")} />
      </div>
    </div>
  );
}
