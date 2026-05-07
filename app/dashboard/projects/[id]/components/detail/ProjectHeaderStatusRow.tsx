import type {ProjectView} from "@/app/core/projects/dto";
import Button from "@/app/components/ui/Button";
import {Plus, FileText} from "lucide-react";

type Props = {
  project: ProjectView;
  status: {color: string; label: string};
  onOpenProductionOrder: () => void;
  onOpenProductionOrders: () => void;
  isAdmin: boolean;
};

export default function ProjectHeaderStatusRow({
  project,
  status,
  onOpenProductionOrder,
  onOpenProductionOrders,
}: Props) {
  return (
    <div className="mb-8 mt-6 flex flex-col gap-4">
      <div className="flex gap-4 ">
        <div className="status-pill flex items-center gap-1.5 rounded-2xl border border-blue-100 px-3 py-1 bg-blue-50  text-sm text-blue-600">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{backgroundColor: status.color}}
          />
          {status.label}
        </div>

        <div
          className={`status-pill px-3 py-1 rounded-2xl border text-sm ${
            project.deliveryDoneAt
              ? "border-emerald-100 bg-emerald-50 text-emerald-600"
              : project.deliveryDueAt
                ? "border-amber-100 bg-amber-50 text-amber-600"
                : "border-red-100 bg-red-50 text-red-600"
          }`}>
          {project.deliveryDoneAt
            ? `Entregado: ${project.deliveryDoneAt}`
            : project.deliveryDueAt
              ? `Entrega estimada: ${project.deliveryDueAt}`
              : "Sin fecha estimada"}
        </div>

        <div className="status-pill rounded-2xl border border-slate-200 bg-slate-100 px-3 py-1 text-sm text-slate-600">
          Responsable: {project.responsible}
        </div>
      </div>

      <div>
        {project.requiresProductionOrder && (
          <div className="flex gap-2">
            {project.latestProductionOrderId ? (
              <>
                <Button onClick={onOpenProductionOrders}>
                  <FileText /> Ver ordenes OP
                </Button>

                <Button variant="secondary" onClick={onOpenProductionOrder}>
                  <Plus /> Generar OP nueva
                </Button>
              </>
            ) : (
              <Button onClick={onOpenProductionOrder}>Generar OP</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
