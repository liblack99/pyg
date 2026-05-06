import type {ProjectView} from "@/app/core/projects/dto";
import Button from "@/app/components/ui/Button";

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
    <div className="mb-8 mt-6 flex flex-wrap gap-3">
      <div className="status-pill flex items-center gap-1.5 rounded-2xl border border-blue-100 bg-blue-50 px-2.5 py-2 text-sm text-blue-600">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{backgroundColor: status.color}}
        />
        {status.label}
      </div>

      <div
        className={`status-pill rounded-2xl border px-2.5 pt-2 text-sm ${
          project.deliveryDoneAt
            ? "border-emerald-100 bg-emerald-50 text-emerald-600"
            : project.deliveryDueAt
              ? "border-amber-100 bg-amber-50 text-amber-600"
              : "border-red-100 bg-red-50 text-red-600"
        }`}>
        {project.deliveryDoneAt
          ? `Entregado: ${new Date(project.deliveryDoneAt).toLocaleDateString("es-ES")}`
          : project.deliveryDueAt
            ? `Entrega estimada: ${new Date(project.deliveryDueAt).toLocaleDateString("es-ES")}`
            : "Sin fecha estimada"}
      </div>

      <div className="status-pill rounded-2xl border border-slate-200 bg-slate-100 px-2.5 pt-2 text-sm text-slate-600">
        Responsable: {project.responsible}
      </div>

      {project.requiresProductionOrder && (
        <div className="flex gap-2">
          {project.latestProductionOrderId ? (
            <>
              <Button onClick={onOpenProductionOrders}>Ver ordenes OP</Button>

              <Button variant="secondary" onClick={onOpenProductionOrder}>
                Generar OP nueva
              </Button>
            </>
          ) : (
            <Button onClick={onOpenProductionOrder}>Generar OP</Button>
          )}
        </div>
      )}
    </div>
  );
}
