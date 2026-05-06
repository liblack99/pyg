"use client";

import type {ProjectView} from "@/app/core/projects/dto";
import {useMemo} from "react";
import {useProjectForm} from "../../../hooks/useProjectForm";
import {useProductionOrderStore} from "../../store/productionOder.store";
import {useProductionOrderViewStore} from "../../store/productionOrderView.store";
import {
  PROJECT_STAGES,
  computeProjectStage,
} from "@/app/core/projects/domain/project-stage";
import ProjectStageTimeline from "./ProjectStageTimeline";

import ProjectHeaderMainInfo from "./ProjectHeaderMainInfo";
import ProjectHeaderStatusRow from "./ProjectHeaderStatusRow";

function statusMeta(status: string) {
  switch (status) {
    case "ACTIVE":
      return {color: "#155dfc", label: "En progreso"};
    case "CLOSED":
      return {color: "#008000", label: "Completado"};
    case "CANCELLED":
      return {color: "red", label: "Cancelado"};
    default:
      return {color: "white", label: status};
  }
}

export default function ProjectDetailHeader({
  project,
  isAdmin,
}: {
  project: ProjectView;
  isAdmin: boolean;
}) {
  const projectForm = useProjectForm();
  const openByIdOp = useProductionOrderStore((s) => s.openById);
  const openProductionOrders = useProductionOrderViewStore((s) => s.openList);

  const stageKey = useMemo(() => computeProjectStage(project), [project]);
  const st = statusMeta(project.status);
  const title = project.clientSnapshot?.name || `Proyecto ${project.code}`;

  return (
    <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="mb-8 w-full">
          <ProjectHeaderMainInfo
            project={project}
            title={title}
            onEdit={() => projectForm.openUpdate(project.id, project)}
          />

          <ProjectHeaderStatusRow
            project={project}
            status={st}
            isAdmin={isAdmin}
            onOpenProductionOrder={() => openByIdOp(project.id)}
            onOpenProductionOrders={() => openProductionOrders(project.id)}
          />

          <ProjectStageTimeline
            stages={PROJECT_STAGES}
            currentStageKey={stageKey}
          />
        </div>
      </div>
    </div>
  );
}
