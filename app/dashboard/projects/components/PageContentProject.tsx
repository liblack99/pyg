import React from "react";
import PageHeader from "@/app/components/layout/PageHeader";
import {Section} from "@/app/components/layout/Section";
import ProjectsSummary from "./ProjectSummary";
import ProjectToolbar from "./ProjectToolBar";
import ProjectTable from "./ProjectTable";
import type {ProjectDashboardStats} from "@/app/core/projects/dto";
import type {ProjectListItem, ProjectListQuery} from "@/app/core/projects/dto";
import type {CursorPage} from "@/app/core/shared/types/pagination.types";

interface Props {
  summary: ProjectDashboardStats;
  listProjects: CursorPage<ProjectListItem>;
  query: ProjectListQuery;
}

export default function PageContentProject({
  summary,
  listProjects,
  query,
}: Props) {
  return (
    <Section>
      <PageHeader title="Proyectos" subtitle="Gestiona tus proyectos" />
      <ProjectsSummary data={summary} />
      <div className=" flex flex-col gap-6 bg-white pt-6 rounded-xl shadow-sm overflow-hidden ">
        <ProjectToolbar />
        <ProjectTable
          initialItems={listProjects.items}
          initialNextCursor={listProjects.nextCursor}
          query={query}
        />
      </div>
    </Section>
  );
}
