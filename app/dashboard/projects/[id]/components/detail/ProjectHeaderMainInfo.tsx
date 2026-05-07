import type {ProjectView} from "@/app/core/projects/dto";
import {FileText} from "lucide-react";

type Props = {
  project: ProjectView;
  title: string;
};

export default function ProjectHeaderMainInfo({project, title}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <span className="text-sm font-semibold uppercase tracking-wider flex gap-2 justify-center items-center text-blue-600">
            <FileText className="h-4 w-4" aria-hidden="true" /> {project.code}
          </span>

          <span className="text-slate-300">|</span>

          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Cotización: {project?.quotation?.numberQuotation ?? "—"}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
      </div>
    </div>
  );
}
