import React from "react";
import {Section} from "@/app/components/layout/Section";
import PageHeader from "@/app/components/layout/PageHeader";
import {ClientListItem} from "@/app/core/clients/dto";
import {can} from "@/app/lib/auth.types";
import type {Me} from "@/app/lib/auth.types";
import ClientsTable from "./ClientsTable";
import ClientsToolbar from "./ClientsToolbar";
import ClientsSummary from "./ClientsSumary";
import {ClientDashboardStats} from "@/app/core/clients/dto";
import type {CursorPage} from "@/app/core/shared/types/pagination.types";
import type {ToolbarValues} from "./ClientsToolbar";

interface Props {
  clients: CursorPage<ClientListItem>;
  me: Me;
  summary: ClientDashboardStats;
  values: ToolbarValues;
}

export default function PageContentClient({
  clients,
  me,
  summary,
  values,
}: Props) {
  return (
    <Section>
      <PageHeader
        title="Clientes"
        subtitle="Gestiona tus clientes"
        href="/dashboard/clients/new"
        textButton="Nuevo cliente"
      />
      <ClientsSummary data={summary} />
      <div className=" flex flex-col gap-6 bg-white pt-6 rounded-xl shadow-sm overflow-hidden ">
        <ClientsToolbar values={values} canManage={can(me, "clients:manage")} />
        <ClientsTable
          initialItems={clients.items}
          initialNextCursor={clients.nextCursor}
          canManage={can(me, "clients:manage")}
        />
      </div>
    </Section>
  );
}
