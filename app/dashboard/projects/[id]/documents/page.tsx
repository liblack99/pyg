import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import ProjectDocuments from "./components/ProjectDocuments";
import type {ProjectView} from "@/app/core/projects/dto";

export default async function ProjectDocumentsPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;

  const me = await fetchServer<Me>("/api/me");

  const project = await fetchServer<ProjectView>(`/api/projects/${id}`);

  if (!can(me, "project:manage_tasks")) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-sm text-red-600">
          No tienes permiso para administrar documentos del proyecto.
        </p>
      </div>
    );
  }

  return <ProjectDocuments projectId={project.id} projectCode={project.code} />;
}
