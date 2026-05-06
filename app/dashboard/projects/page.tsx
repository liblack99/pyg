// app/dashboard/quotations/new/page.tsx
import Link from "next/link";
import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import type {ProjectDashboardStats} from "@/app/core/projects/dto";
import type {ProjectListQuery, ProjectListItem} from "@/app/core/projects/dto";

import PageContentProject from "./components/PageContentProject";
import type {CursorPage} from "@/app/core/shared/types/pagination.types";

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: Promise<ProjectListQuery>;
}) {
  const me = await fetchServer<Me>("/api/me");

  const params = await searchParams;

  const qs = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  });

  if (!qs.has("limit")) qs.set("limit", "20");

  if (!can(me, "project:read")) {
    return (
      <div className="p-6">
        <p className="text-red-600">No tienes permiso.</p>
        <Link href="/dashboard/projects">Volver</Link>
      </div>
    );
  }

  const listProjects = await fetchServer<CursorPage<ProjectListItem>>(
    `/api/projects?${qs.toString()}`,
  );
  const summary = await fetchServer<ProjectDashboardStats>(
    `/api/projects/summary`,
  );

  return (
    <PageContentProject
      summary={summary}
      listProjects={listProjects}
      query={params}
    />
  );
}
