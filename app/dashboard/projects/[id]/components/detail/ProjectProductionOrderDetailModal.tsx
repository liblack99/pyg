"use client";

import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import {useProductionOrderHistory} from "../../hooks/useProductionOrderHistory";
import ProductionOrderPreview from "../ProductionOrder/ProductionOrderPreview";
import {isProductionOrderApproved} from "@/app/core/projects/orderPdf/utils/production-order-status";

type Props = {
  isAdmin: boolean;
};

export default function ProjectProductionOrderDetailModal({isAdmin}: Props) {
  const {
    detailOpen,
    closeDetail,
    selected,
    loadingDetail,
    approving,
    error,
    approve,
    download,
  } =
    useProductionOrderHistory();
  const isApproved = isProductionOrderApproved(selected?.payload);

  return (
    <Modal
      open={detailOpen}
      onClose={closeDetail}
      title={selected?.orderNumber ?? "Detalle de orden de produccion"}>
      <div className="space-y-4">
        {loadingDetail ? (
          <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
            Cargando detalle...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {selected ? <ProductionOrderPreview record={selected} /> : null}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={closeDetail}>
            Cerrar
          </Button>

          {selected && isApproved ? (
            <Button variant="secondary" onClick={() => download(selected.id)}>
              Descargar PDF
            </Button>
          ) : null}

          {isAdmin && selected && !isApproved ? (
            <Button onClick={approve} disabled={approving}>
              {approving ? "Aprobando..." : "Aprobar"}
            </Button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
