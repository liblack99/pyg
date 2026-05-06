"use client";

import type {ProductionOrderRecord} from "@/app/core/projects/orderPdf/dto";
import {
  getProductionOrderAuthorizationLabel,
  getProductionOrderDocumentStatusLabel,
  getProductionOrderReviewLabel,
} from "@/app/core/projects/orderPdf/utils/production-order-status";
import Image from "next/image";

function toNumber(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function moneyCOP(v: unknown) {
  const n = toNumber(v);
  return n.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function ProductionOrderPreview({
  record,
}: {
  record: ProductionOrderRecord;
}) {
  const op = record.payload;
  const primaryName = op.projectName ?? "-";
  const items = op.items ?? [];
  const totalItems = items.reduce((acc, it) => acc + (it.quantity ?? 0), 0);

  return (
    <div className="mx-auto w-full max-w-5xl rounded-xl border border-slate-200 bg-white p-4 text-[13px] text-slate-900">
      <div className="flex flex-col justify-between items-center gap-6 md:flex-row">
        <div className="md:w-[58%]">
          <div className="rounded-lg ">
            <div className="flex items-center gap-3">
              <Image
                src="/parque_y_grama.png"
                alt="Logo Parque y Grama"
                width={180}
                height={40}
                unoptimized
              />
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              Parque y Grama Construcciones S.A.S.
            </p>
          </div>

          <div className="mt-2 space-y-1 text-sm  text-slate-700">
            <p>NIT: 901.495.979-7</p>
            <p>Telefono: (+57) (5) 339 6767</p>
            <p>Direccion: Carrera 67 # 76-102</p>
            <p>Barranquilla - Colombia</p>
          </div>
        </div>

        <div className=" ">
          <h3 className="mt-1 text-xl font-bold text-right">
            {op.orderNumber ? `No. ${op.orderNumber}` : "-"}
          </h3>

          <div className="mt-2 rounded-lg ">
            <p className=" font-semibold  ">Cliente / Proyecto:</p>
            <h1 className=" text-2xl font-bold tracking-tight text-slate-950">
              {primaryName}
            </h1>
          </div>

          <div className="mt-1 space-y-1 text-sm text-slate-700">
            <p>
              <span className="text-slate-500">Fecha:</span> {op.date ?? "-"}
            </p>

            <p>
              <span className="text-slate-500">Proveedor:</span>{" "}
              {op.providerName ?? "-"}
            </p>
            <p>
              <span className="text-slate-500">Estado:</span>{" "}
              {getProductionOrderDocumentStatusLabel(op)}
            </p>
          </div>
        </div>
      </div>

      <div className="my-5 h-px bg-slate-200" />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="md:w-[62%]">
          <h4 className="mb-2 text-sm font-bold uppercase tracking-wide">
            Referencia
          </h4>
          <p className="leading-6 text-slate-800">{op.reference ?? "-"}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Forma de instalacion</p>
              <p className="mt-1 font-medium text-slate-900">
                {op.installationMethod ?? "-"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Fecha de entrega</p>
              <p className="mt-1 font-medium text-slate-900">
                {op.deliveryDateText ?? "-"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Color</p>
              <p className="mt-1 font-medium text-slate-900">
                {op.color ?? "-"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Items</p>
              <p className="mt-1 font-medium text-slate-900">
                {items.length} - Cant. total {totalItems}
              </p>
            </div>
          </div>
        </div>

        <div className="md:w-[38%]">
          <h4 className="mb-2 text-sm font-bold uppercase tracking-wide">
            Observaciones
          </h4>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="whitespace-pre-wrap leading-6 text-slate-700">
              {op.observations ?? "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="my-5 h-px bg-slate-200" />

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="grid grid-cols-[7%_45%_14%_17%_17%] bg-slate-100 px-2 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">
          <div>#</div>
          <div>Descripcion</div>
          <div className="text-right">Cant</div>
          <div className="text-right">Valor unitario</div>
          <div className="text-right">Valor</div>
        </div>

        <div>
          {items.map((it, idx) => (
            <div
              key={`${it.description}-${idx}`}
              className="grid grid-cols-[7%_45%_14%_17%_17%] border-t border-slate-200 px-2 py-3 text-sm">
              <div className="text-slate-500">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="font-semibold text-slate-900">
                {it.description || "Item"}
              </div>
              <div className="text-right text-slate-900">
                {toNumber(it.quantity)}
              </div>
              <div className="text-right text-slate-900">
                {moneyCOP(it.unitCost)}
              </div>
              <div className="text-right font-bold text-slate-900">
                {moneyCOP(it.totalCost)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <div className="w-full rounded-lg border border-slate-200 p-4 md:w-[58%]">
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide">
            Resumen de costos
          </h4>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Costo de fabricacion</span>
              <span>{moneyCOP(op.fabricationCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Administracion</span>
              <span>{moneyCOP(op.administrativeCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Imprevistos</span>
              <span>{moneyCOP(op.impCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Utilidad</span>
              <span>{moneyCOP(op.utilCost)}</span>
            </div>

            <div className="my-3 h-px bg-slate-200" />

            <div className="flex items-center justify-between font-bold">
              <span>Subtotal</span>
              <span>{moneyCOP(op.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">IVA</span>
              <span>{moneyCOP(op.iva)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">ReteFuente</span>
              <span>- {moneyCOP(op.retentions)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">ReteICA</span>
              <span>- {moneyCOP(op.reteica)}</span>
            </div>

            <div className="my-3 h-px bg-slate-200" />

            <div className="flex items-center justify-between text-base font-bold">
              <span>Valor a pagar</span>
              <span>{moneyCOP(op.totalCost)}</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            * Valores expresados en COP.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Elaboro</p>
          <p className="mt-1 font-bold text-slate-900">
            {op.elaboratedBy ?? "-"}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Reviso</p>
          <p className="mt-1 font-bold text-slate-900">
            {getProductionOrderReviewLabel(op)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Autorizo</p>
          <p className="mt-1 font-bold text-slate-900">
            {getProductionOrderAuthorizationLabel(op)}
          </p>
        </div>
      </div>
    </div>
  );
}
