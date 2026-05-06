import React from "react";
import {Section} from "@/app/components/layout/Section";
import PageHeader from "@/app/components/layout/PageHeader";
import ClientEditForm from "./ClientEditForm";
import {ClientListItem} from "@/app/core/clients/dto";
import {can} from "@/app/lib/auth.types";
import type {Me} from "@/app/lib/auth.types";
import Link from "next/link";

interface Props {
  client: ClientListItem;
  me: Me;
}

export default function PageContentEditClient({client, me}: Props) {
  if (!can(me, "clients:manage")) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Editar Client</h1>
        <p className="text-sm text-red-600">
          No tienes permiso para administrar Client.
        </p>
        <Link
          className="inline-block rounded border px-3 py-2 text-sm"
          href="/dashboard/clients">
          Volver
        </Link>
      </div>
    );
  }
  return (
    <Section>
      <PageHeader
        title={"Editar cliente"}
        subtitle={`Editando cliente: ${client.name}`}
        href="/dashboard/clients"
        textButton="Volver"
        variantButton="outline"
      />
      <ClientEditForm userId={client.id} defaultsData={client} />
    </Section>
  );
}
