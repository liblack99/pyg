import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import {ProjectInstallation} from "./components/ProjectInstallation";

export default async function ProjectInstallationPage({
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
          No tienes permiso para administrar instalaciones.
        </p>
      </div>
    );
  }

  return <ProjectInstallation projectId={id} />;
}
