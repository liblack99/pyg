"use client";

import CardDashboard from "../../../components/ui/CardDashboard";
import type {ClientDashboardStats} from "@/app/core/clients/dto";
import {TrendingUpIcon, Users, DollarSignIcon, Folder} from "lucide-react";

interface Props {
  data: ClientDashboardStats;
}

export default function ClientsSummary({data}: Props) {
  if (!data)
    return (
      <div className="p-8 text-center text-slate-500">Cargando métricas...</div>
    );

  return (
    <div className="space-y-8 bg-gray-50">
      {/* SECCIÓN 1: Métricas Operativas (Existentes) */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardDashboard
          title="Total clientes"
          value={data.totalClients.count}
          subtext={data.totalClients.subtext}
          isPositive={data.totalClients.isPositive}
          icon={<Users className="text-blue-500" />}
        />
        <CardDashboard
          title="Clientes activos"
          value={data.activeClients.count}
          subtext={data.activeClients.subtext}
          isPositive={data.activeClients.isPositive}
          icon={<TrendingUpIcon className="text-emerald-500" />}
        />
        <CardDashboard
          title="Ingresos totales"
          value={data.totalRevenue.formatted}
          subtext={data.totalRevenue.subtext}
          isPositive={data.totalRevenue.isPositive}
          icon={<DollarSignIcon className="text-amber-500" />}
        />
        <CardDashboard
          title="Proyectos activos"
          value={data.activeProjects.count}
          subtext={data.activeProjects.subtext}
          isPositive={data.activeProjects.isPositive}
          icon={<Folder className="text-purple-500" />}
        />
      </div>
    </div>
  );
}
