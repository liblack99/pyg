// app/dashboard/quotations/components/QuotationInvoiceView.tsx
"use client";

import type {
  Quotation,
  QuotationItem,
  QuotationTerm,
} from "@/app/core/quotations/dto";
import Image from "next/image";

type ClientSnap = {
  name?: string;
  documentType?: string;
  documentNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  contact?: string;
  city?: string;
};

function fmtDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function moneyCOP(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

function pct(base: number, p: number) {
  return (base * (p ?? 0)) / 100;
}

function lineSubtotal(it: QuotationItem) {
  return (it.quantity ?? 0) * (it.unitPrice ?? 0);
}

function lineAdmin(it: QuotationItem) {
  return pct(lineSubtotal(it), it.adminPercent ?? 0);
}
function lineImpr(it: QuotationItem) {
  return pct(lineSubtotal(it), it.imprPercent ?? 0);
}
function lineUtil(it: QuotationItem) {
  return pct(lineSubtotal(it), it.utilPercent ?? 0);
}
function lineIva(it: QuotationItem) {
  // IVA/U típicamente sobre la utilidad
  return pct(lineUtil(it), it.ivaPercent ?? 0);
}
function lineTotal(it: QuotationItem) {
  const sub = lineSubtotal(it);
  return sub + lineAdmin(it) + lineImpr(it) + lineUtil(it) + lineIva(it);
}

function acceptedTerms(terms?: QuotationTerm[]) {
  if (!terms?.length) return [];
  return terms.filter((t) => t.accepted).sort((a, b) => a.order - b.order);
}

function MetaRow({label, value}: {label: string; value: React.ReactNode}) {
  return (
    <div className="flex flex-col items-start justify-between gap-4">
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="text-sm text-slate-700 dark:text-slate-200">{value}</div>
    </div>
  );
}

export default function QuotationInvoiceView({q}: {q: Quotation}) {
  const client = q.clientSnapshot as unknown as ClientSnap;
  const items = q.items ?? [];
  const termsOk = acceptedTerms(q.terms);

  return (
    <div className="mx-auto w-full  mt-1">
      {/* “Papel” */}
      <div className="rounded-md bg-white p-8 shadow-sm ring-1 ring-black/5 dark:bg-slate-950 dark:ring-white/10">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/parque_y_grama.png"
                alt="Logo Parque y Grama"
                width={140}
                height={40}
                unoptimized
              />
            </div>
            <div className="mt-4 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <div>NIT: 901.495.979-7</div>
              <div>Telefono: (+57) (5) 339 6767</div>
              <div>Direccion: Carrera 67 # 76-102</div>
              <div>Barranquilla • Colombia</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Cotización
            </div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {q.numberQuotation}
            </div>

            <div className="mt-3 space-y-1">
              <div className="text-sm text-slate-700 dark:text-slate-200">
                <span className="text-slate-400">Fecha:</span> {fmtDate(q.date)}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-200">
                <span className="text-slate-400">Vigencia:</span> {q.validDays}{" "}
                días
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-slate-100 dark:bg-slate-800" />

        {/* Cliente + Proyecto (sin cajas, solo layout limpio) */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Cliente
            </div>
            <div className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
              {client?.name ?? "Sin cliente"}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {client?.documentType ?? "Documento"}:{" "}
              {client?.documentNumber ?? "—"}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <MetaRow label="Contacto" value={client?.contact ?? "—"} />
              <MetaRow label="Teléfono" value={client?.phone ?? "—"} />
              <MetaRow label="Email" value={client?.email ?? "—"} />
              <MetaRow
                label="Dirección"
                value={
                  <span className="text-sm">
                    {client?.address ?? "—"}
                    {client?.city ? ` • ${client.city}` : ""}
                  </span>
                }
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Detalles del Proyecto
            </div>
            <div className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
              {`${q.projectReference}  ${q.projectReferenceDetail}` || "—"}
            </div>
            <div className="text-xs mt-2 font-semibold uppercase tracking-wide text-slate-400">
              Presetancion
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {q.projectPresentation || ""}
            </div>

            {q.reviewTitle || q.reviewDetails ? (
              <>
                <div className="my-6 h-px bg-slate-100 dark:bg-slate-800" />
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Reseña
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                  {q.reviewTitle ?? "—"}
                </div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                  {q.reviewDetails ?? ""}
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-slate-100 dark:bg-slate-800" />

        {/* Tabla items */}
        <div className="overflow-hidden rounded-2xl ring-1 ring-slate-100 dark:ring-slate-800">
          <div className="grid grid-cols-12 gap-3 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Detalle</div>
            <div className="col-span-1 text-right">Und</div>
            <div className="col-span-1 text-right">Cant</div>
            <div className="col-span-1 text-right">P/U</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((it, idx) => {
              const sub = lineSubtotal(it);
              const admin = lineAdmin(it);
              const impr = lineImpr(it);
              const util = lineUtil(it);
              const iva = lineIva(it);
              const total = lineTotal(it);

              return (
                <div key={it.id} className="px-5 py-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-1 text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </div>

                    <div className="col-span-6">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {it.productName}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {it.description}
                      </div>

                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {it.code ? `Código: ${it.code}` : ""}
                      </div>

                      {/* Desglose plegable (se ve elegante y no “cuadros”) */}
                      <details className="mt-2">
                        <summary className="cursor-pointer select-none text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                          Ver desglose (AIU / IVA)
                        </summary>
                        <div className="mt-3 grid gap-1 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="tabular-nums">
                              {moneyCOP(sub)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Admin {it.adminPercent}%</span>
                            <span className="tabular-nums">
                              {moneyCOP(admin)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Impr {it.imprPercent}%</span>
                            <span className="tabular-nums">
                              {moneyCOP(impr)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Util {it.utilPercent}%</span>
                            <span className="tabular-nums">
                              {moneyCOP(util)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>IVA/U {it.ivaPercent}%</span>
                            <span className="tabular-nums">
                              {moneyCOP(iva)}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-semibold dark:border-slate-800">
                            <span>Total ítem</span>
                            <span className="tabular-nums">
                              {moneyCOP(total)}
                            </span>
                          </div>
                        </div>
                      </details>
                    </div>

                    <div className="col-span-1 text-right text-sm text-slate-700 dark:text-slate-200">
                      {it.unit}
                    </div>
                    <div className="col-span-1 text-right text-sm text-slate-700 dark:text-slate-200 tabular-nums">
                      {it.quantity}
                    </div>
                    <div className="col-span-1 text-right text-sm text-slate-700 dark:text-slate-200 tabular-nums">
                      {moneyCOP(it.unitPrice)}
                    </div>

                    <div className="col-span-2 text-right text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                      {moneyCOP(total)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totales */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
              <span>Total general</span>
              <span className="tabular-nums">
                {items.length} {items.length > 1 ? "Productos" : "Producto"}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Valor
              </span>
              <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {moneyCOP(q.totalGeneral)}
              </span>
            </div>
            <div className="mt-3 h-px bg-slate-100 dark:bg-slate-800" />
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              * Valores expresados en COP.
            </div>
          </div>
        </div>

        {/* Condiciones (en texto limpio) */}
        {(q.timeDelivery ||
          q.workLocation ||
          q.guarantees ||
          q.commercialCondition ||
          q.paymentMethod ||
          q.specialConditions) && (
          <>
            <div className="my-8 h-px bg-slate-100 dark:bg-slate-800" />
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Condiciones
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {q.timeDelivery ? (
                <MetaRow label="Tiempo entrega" value={q.timeDelivery} />
              ) : null}
              {q.workLocation ? (
                <MetaRow label="Lugar de trabajo" value={q.workLocation} />
              ) : null}
              {q.paymentMethod ? (
                <MetaRow label="Forma de pago" value={q.paymentMethod} />
              ) : null}
              {q.guarantees ? (
                <MetaRow label="Garantías" value={q.guarantees} />
              ) : null}
              {q.commercialCondition ? (
                <div className="md:col-span-2">
                  <MetaRow
                    label="Condición comercial"
                    value={
                      <span className="whitespace-pre-wrap">
                        {q.commercialCondition}
                      </span>
                    }
                  />
                </div>
              ) : null}
              {q.specialConditions ? (
                <div className="md:col-span-2">
                  <MetaRow
                    label="Condiciones especiales"
                    value={
                      <span className="whitespace-pre-wrap">
                        {q.specialConditions}
                      </span>
                    }
                  />
                </div>
              ) : null}
            </div>
          </>
        )}

        {/* Términos aceptados */}
        {termsOk.length ? (
          <>
            <div className="my-8 h-px bg-slate-100 dark:bg-slate-800" />
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Términos aceptados
            </div>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {termsOk.map((t) => (
                <li key={t.id} className="whitespace-pre-wrap leading-relaxed">
                  {t.text}
                </li>
              ))}
            </ol>
          </>
        ) : null}

        {/* Footer */}
        <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Elaborado por:{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {q.createdBy ?? "—"}
            </span>
          </div>
          <div className="tabular-nums">
            {q.numberQuotation} • {fmtDate(q.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
