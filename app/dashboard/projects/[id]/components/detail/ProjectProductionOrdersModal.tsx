"use client";

import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import {useProductionOrderHistory} from "../../hooks/useProductionOrderHistory";
import {
  getProductionOrderStatusLabel,
  isProductionOrderApproved,
} from "@/app/core/projects/orderPdf/utils/production-order-status";

export default function ProjectProductionOrdersModal() {
  const {listOpen, closeList, items, loadingList, error, openDetail, download} =
    useProductionOrderHistory();

  return (
    <Modal open={listOpen} onClose={closeList} title="Ordenes de produccion">
      <div className="space-y-4">
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {!loadingList && items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
            Este proyecto aun no tiene ordenes de produccion creadas.
          </div>
        ) : null}

        <div className="space-y-3">
          {items.map((item) => {
            const isApproved = isProductionOrderApproved(item);

            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.orderNumber}
                  </p>
                  <p className="text-sm text-slate-600">
                    Version {item.version}
                  </p>
                  <p className="text-xs text-slate-500">
                    Creada:{" "}
                    {new Date(item.createdAt).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isApproved
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                    {getProductionOrderStatusLabel(item)}
                  </span>

                  {isApproved ? (
                    <Button
                      variant="secondary"
                      onClick={() => download(item.id)}>
                      Descargar
                    </Button>
                  ) : null}

                  <Button onClick={() => openDetail(item.id)}>Ver</Button>
                </div>
              </div>
            );
          })}
        </div>

        {loadingList && items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
            Cargando ordenes...
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
