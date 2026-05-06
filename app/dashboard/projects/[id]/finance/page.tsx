import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import {ProjectFinance} from "./components/ProjectFinance";

export default async function ProjectFinancePage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;

  const me = await fetchServer<Me>("/api/me");

  if (!can(me, "project:manage_tasks")) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-red-600">
          No tienes permiso para administrar finanzas del proyecto.
        </p>
      </div>
    );
  }

  return <ProjectFinance projectId={id} />;
}
