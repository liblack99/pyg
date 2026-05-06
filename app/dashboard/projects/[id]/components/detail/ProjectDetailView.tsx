"use client";

import type {ProjectView} from "@/app/core/projects/dto";
import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectTabsNav from "./ProjectTabsNav";
import {ProjectDocumentPreviewModal} from "../../documents/components/ProjectDocumentPreviewModal";
import ProjectFormModal from "./ProjectFormModal";
import ProjectProductionOrderModal from "./ProjectProductionOrderModal";
import ProjectProductionOrdersModal from "./ProjectProductionOrdersModal";
import ProjectProductionOrderDetailModal from "./ProjectProductionOrderDetailModal";
import ProjectFinancialSummaryCard from "./ProjectFinancialSummaryCard";
import {ProjectActivityWidgets} from "./ProjectActivityWidgets";

interface Props {
  project: ProjectView;
  isAdmin: boolean;
  children?: React.ReactNode;
}

export default function ProjectDetailView({project, isAdmin, children}: Props) {
  return (
    <div className="p-4">
      <ProjectDetailHeader project={project} isAdmin={isAdmin} />

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="w-full lg:w-[75%] flex flex-col min-w-0">
          <ProjectTabsNav projectId={project.id} />
          {children}
        </div>

        <aside className="w-full lg:flex-1 flex flex-col gap-4">
          <ProjectFinancialSummaryCard
            totalQuotationSinIVA={project.totalQuotationSinIVA}
            budgetTotal={project.budgetTotal}
            spendingLimit65={project.spendingLimit65}
            remaining={project.remaining}
          />
          <ProjectActivityWidgets projectId={project.id} />
        </aside>
      </div>

      {/* Modales */}
      <ProjectFormModal />
      <ProjectProductionOrderModal />
      <ProjectProductionOrdersModal />
      <ProjectProductionOrderDetailModal isAdmin={isAdmin} />
      <ProjectDocumentPreviewModal />
    </div>
  );
}
