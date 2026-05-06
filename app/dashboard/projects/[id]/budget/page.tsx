import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import type {ProjectView} from "@/app/core/projects/dto";
import {ProjectBudget} from "./components/ProjectBudget";

export default async function ProjectBudgetPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;

  const me = await fetchServer<Me>("/api/me");

  if (!can(me, "project:manage_tasks")) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-sm text-red-600">
          No tienes permiso para administrar cotizaciones.
        </p>
      </div>
    );
  }

  const project = await fetchServer<ProjectView>(`/api/projects/${id}`);

  return <ProjectBudget project={project} />;
}
