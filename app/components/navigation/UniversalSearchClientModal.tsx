"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import LoadingSection from "@/app/components/ui/LoadingSection";
import ErrorSection from "@/app/components/ui/ErrorSection";
import {apiGet} from "@/app/lib/api.client";
import type {ClientListItem} from "@/app/core/clients/dto";
import {formatDate} from "@/app/utils/formatDate";

type Props = {
  open: boolean;
  clientId: string | null;
  onClose: () => void;
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-700">{value || "-"}</p>
    </div>
  );
}

export function UniversalSearchClientModal({open, clientId, onClose}: Props) {
  const router = useRouter();
  const [client, setClient] = useState<ClientListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !clientId) return;

    let active = true;

    async function loadClient() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiGet<ClientListItem>(`/api/clients/${clientId}`);
        if (active) {
          setClient(data);
        }
      } catch (e: unknown) {
        if (active) {
          setError(
            e instanceof Error ? e.message : "No se pudo cargar el cliente.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadClient();

    return () => {
      active = false;
    };
  }, [clientId, open]);

  const footer = useMemo(
    () => (
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
        <Button
          onClick={() => {
            if (!clientId) return;
            onClose();
            router.push(`/dashboard/clients/${clientId}`);
          }}>
          Abrir cliente
        </Button>
      </div>
    ),
    [clientId, onClose, router],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={client ? `Cliente · ${client.name}` : "Cliente"}
      footer={footer}>
      {loading ? <LoadingSection message="Cargando cliente..." /> : null}
      {!loading && error ? <ErrorSection message={error} /> : null}

      {!loading && !error && client ? (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
              Cliente
            </p>
            <h3 className="mt-2 text-2xl font-bold">{client.name}</h3>
            <p className="mt-2 text-sm text-slate-300">
              {client.documentType} {client.documentNumber}
            </p>
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            <DetailRow label="Correo" value={client.email} />
            <DetailRow label="Telefono" value={client.phone} />
            <DetailRow label="Direccion" value={client.address} />
            <DetailRow
              label="Ubicacion"
              value={[client.city, client.department].filter(Boolean).join(", ")}
            />
            <DetailRow label="Contacto principal" value={client.contactName1} />
            <DetailRow label="Cargo principal" value={client.contactRole1} />
            <DetailRow label="Telefono contacto 1" value={client.contactPhone1} />
            <DetailRow label="Contacto secundario" value={client.contactName2} />
            <DetailRow label="Cargo secundario" value={client.contactRole2} />
            <DetailRow label="Telefono contacto 2" value={client.contactPhone2} />
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            <DetailRow label="Creado" value={formatDate(client.createdAt)} />
            <DetailRow label="Actualizado" value={formatDate(client.updatedAt)} />
          </section>
        </div>
      ) : null}
    </Modal>
  );
}
