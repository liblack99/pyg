"use client";

import CardDashboard from "../../../components/ui/CardDashboard";
import type {ProjectDashboardStats} from "@/app/core/projects/dto"; // Ajusta la ruta según tu estructura
import {Briefcase, CalendarClock, DollarSign, AlertCircle} from "lucide-react";

interface Props {
  data: ProjectDashboardStats;
}

export default function ProjectsSummary({data}: Props) {
  if (!data)
    return (
      <div className="p-8 text-center text-slate-500">
        Cargando métricas de proyectos...
      </div>
    );

  // Formateador para el valor total en obra
  const formattedValue = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(data.totalActiveValue);

  return (
    <div className="space-y-8 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Proyectos Activos */}
        <CardDashboard
          title="Proyectos en Ejecución"
          value={data.activeProjectsCount}
          subtext="Frentes de trabajo abiertos"
          isPositive={true}
          icon={<Briefcase className="text-blue-500" />}
        />

        {/* Próximas Entregas */}
        <CardDashboard
          title="Próximas Entregas"
          value={data.upcomingDeliveriesCount}
          subtext="En los próximos 15 días"
          isPositive={data.upcomingDeliveriesCount > 0}
          icon={<CalendarClock className="text-amber-500" />}
        />

        {/* Valor Total */}
        <CardDashboard
          title="Valor Total en Obra"
          value={formattedValue}
          subtext="Presupuesto activo"
          isPositive={true}
          icon={<DollarSign className="text-emerald-500" />}
        />

        {/* Proyectos Retrasados */}
        <CardDashboard
          title="Proyectos Retrasados"
          value={data.overdueProjectsCount}
          subtext="Requieren atención"
          isPositive={false} // Marcamos false para que el diseño pueda mostrar alerta si hay retrasos
          icon={<AlertCircle className="text-red-500" />}
        />
      </div>
    </div>
  );
}
