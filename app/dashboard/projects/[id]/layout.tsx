import {fetchServer} from "@/app/lib/fetch.server";
import ProjectDetailView from "./components/detail/ProjectDetailView";
import type {ProjectView} from "@/app/core/projects/dto";
import type {Me} from "@/app/lib/auth.types";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const [project, me] = await Promise.all([
    fetchServer<ProjectView>(`/api/projects/${id}`),
    fetchServer<Me>("/api/me"),
  ]);

  return (
    <ProjectDetailView
      project={project}
      isAdmin={String(me?.role ?? "").toUpperCase() === "ADMIN"}>
      {children}
    </ProjectDetailView>
  );
}
