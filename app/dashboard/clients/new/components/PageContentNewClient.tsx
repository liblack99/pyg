// app/dashboard/clients/new/page.tsx

import type {Me} from "@/app/lib/auth.types";
import {can} from "@/app/lib/auth.types";
import ClientCreateForm from "./ClientCreateForm";
import PageHeader from "@/app/components/layout/PageHeader";
import Link from "next/link";
import {Section} from "@/app/components/layout/Section";

interface Props {
  me: Me;
}

export default function PageContentNewClient({me}: Props) {
  if (!can(me, "clients:manage")) {
    return (
      <Section>
        <div>
          <h1 className="text-xl font-semibold">Crear cliente</h1>
          <p className="text-sm text-red-600">
            No tienes permiso para administrar clientes.
          </p>
        </div>
        <Link
          href="/dashboard/clients"
          className="inline-block rounded border px-3 py-2 text-sm hover:bg-neutral-50">
          Volver
        </Link>
      </Section>
    );
  }

  return (
    <Section>
      <PageHeader
        title="Crear cliente"
        subtitle="Agrega un nuevo cliente"
        href="/dashboard/clients"
        textButton="Volver"
        variantButton="outline"
      />
      <ClientCreateForm />
    </Section>
  );
}
