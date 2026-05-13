import {Clock3, ShieldCheck, UserCheck, Users} from "lucide-react";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import type {UserListItem} from "@/app/core/users/dto";

import CardDashboard from "@/app/components/ui/CardDashboard";

type Props = {
  users: UserListItem[];
};

function isRecentLogin(value: Date | string | null): boolean {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return date >= sevenDaysAgo;
}

export function UserStats({users}: Props) {
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;
  const rolesInUse = new Set(users.map((user) => user.role.name)).size;
  const recentLogins = users.filter((user) =>
    isRecentLogin(user.lastLoginAt),
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Usuarios Totales: Siempre informativo (Positive true por defecto) */}
      <CardDashboard
        title="Usuarios"
        value={totalUsers}
        icon={<Users className="text-blue-500" />}
        subtext={"Cuentas registradas"}
      />

      {/* Activos: Es negativo si hay más de 0 inactivos (por ejemplo) */}
      <CardDashboard
        title="Activos"
        value={activeUsers}
        icon={<UserCheck className="text-emerald-500" />}
        subtext={`${inactiveUsers} inactivos`}
        isPositive={inactiveUsers === 0} // Rojo si hay inactivos, verde si todos están activos
      />

      <CardDashboard
        title="Roles"
        value={rolesInUse}
        icon={<ShieldCheck className="text-indigo-500" />}
        subtext={"Perfiles en uso"}
      />

      {/* Accesos Recientes: Podría ser rojo si nadie ha entrado en 7 días */}
      <CardDashboard
        title="Accesos recientes"
        value={recentLogins}
        icon={<Clock3 className="text-amber-500" />}
        subtext={"Últimos 7 días"}
        isPositive={recentLogins > 0} // Rojo si está en 0 para alertar falta de actividad
      />
    </div>
  );
}
