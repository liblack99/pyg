import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import {ProjectWarranty} from "./components/ProjectWarranty";
import type {ProjectView} from "@/app/core/projects/dto";
export default async function ProjectFabricationPage({
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

  return <ProjectWarranty project={project} />;
}
