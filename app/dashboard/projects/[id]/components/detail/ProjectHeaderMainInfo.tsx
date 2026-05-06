import type {ProjectView} from "@/app/core/projects/dto";
import Button from "@/app/components/ui/Button";

type Props = {
  project: ProjectView;
  title: string;
  onEdit: () => void;
};

export default function ProjectHeaderMainInfo({project, title, onEdit}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {project.code}
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

      <div className="flex gap-2">
        <Button variant="outline">Exportar Informe</Button>

        <Button variant="primary" onClick={onEdit}>
          Editar Proyecto
        </Button>
      </div>
    </div>
  );
}
