"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import LoadingSection from "@/app/components/ui/LoadingSection";
import ErrorSection from "@/app/components/ui/ErrorSection";

import {apiGet} from "@/app/lib/api.client";
import type {Quotation} from "@/app/core/quotations/dto";

import QuotationInvoiceView from "@/app/dashboard/quotations/components/QuotationInvoiceView";

type Props = {
  open: boolean;
  quotationId: string | null;
  onClose: () => void;
};

export function UniversalSearchQuotationModal({
  open,
  quotationId,
  onClose,
}: Props) {
  const router = useRouter();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !quotationId) return;

    let active = true;

    async function loadQuotation() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiGet<Quotation>(`/api/quotations/${quotationId}`);
        if (active) {
          setQuotation(data);
        }
      } catch (e: unknown) {
        if (active) {
          setError(
            e instanceof Error ? e.message : "No se pudo cargar la cotizacion.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadQuotation();

    return () => {
      active = false;
    };
  }, [open, quotationId]);

  const footer = useMemo(
    () => (
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
        <Button
          onClick={() => {
            if (!quotationId) return;
            onClose();
            router.push(`/dashboard/quotations/${quotationId}`);
          }}>
          Abrir cotizacion
        </Button>
      </div>
    ),
    [onClose, quotationId, router],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        quotation ? `Cotizacion · ${quotation.numberQuotation}` : "Cotizacion"
      }
      footer={footer}>
      {loading ? <LoadingSection message="Cargando cotizacion..." /> : null}
      {!loading && error ? <ErrorSection message={error} /> : null}
      {/* 
      {!loading && !error && quotation ? (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Cotizacion
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {quotation.numberQuotation}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {getClientName(quotation.clientSnapshot)}
                </p>
              </div>
              <StatusBadge status={quotation.status} />
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <DetailCard label="Fecha" value={formatDate(quotation.date)} />
            <DetailCard
              label="Validez"
              value={`${quotation.validDays ?? 0} dias`}
            />
            <DetailCard
              label="Total"
              value={moneyCOP(quotation.totalGeneral)}
            />
            <DetailCard
              label="Creado por"
              value={quotation.createdBy ?? null}
            />
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            <DetailCard label="Referencia" value={quotation.projectReference} />
            <DetailCard
              label="Detalle referencia"
              value={quotation.projectReferenceDetail ?? null}
            />
            <DetailCard
              label="Metodo de pago"
              value={quotation.paymentMethod ?? null}
            />
            <DetailCard
              label="Tiempo entrega"
              value={quotation.timeDelivery ?? null}
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Presentacion del proyecto
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {quotation.projectPresentation || "-"}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Items
              </h4>
              <span className="text-xs font-semibold text-slate-400">
                {quotation.items?.length ?? 0} registrados
              </span>
            </div>

            <div className="space-y-3">
              {(quotation.items ?? []).slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {item.productName ?? item.code}
                    </p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      {item.quantity} {item.unit}
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {moneyCOP(item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {(quotation.items?.length ?? 0) > 5 ? (
              <p className="mt-3 text-xs text-slate-400">
                Se muestran los primeros 5 items.
              </p>
            ) : null}
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            <DetailCard
              label="Condiciones especiales"
              value={quotation.specialConditions ?? null}
            />
            <DetailCard
              label="Garantias"
              value={quotation.guarantees ?? null}
            />
            <DetailCard
              label="Condicion comercial"
              value={quotation.commercialCondition ?? null}
            />
            <DetailCard label="Nota" value={quotation.note ?? null} />
          </section>
        </div>
      ) : null} */}

      {!loading && !error && quotation ? (
        <QuotationInvoiceView q={quotation} />
      ) : null}
    </Modal>
  );
}
