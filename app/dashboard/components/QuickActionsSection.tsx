"use client";

import QuickActionCard from "./QuickActionCard";
import {DASHBOARD_QUICK_ACTIONS} from "../const/quickActions";

type QuickActionsSectionProps = {
  permissions: string[];
};

export default function QuickActionsSection({
  permissions,
}: QuickActionsSectionProps) {
  const actions = DASHBOARD_QUICK_ACTIONS.filter((action) =>
    action.permission ? permissions.includes(action.permission) : true,
  );

  if (!actions.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Acciones rápidas
        </h2>
        <p className="text-sm text-slate-500">
          Accesos directos según los permisos del usuario.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <QuickActionCard
            key={action.key}
            label={action.label}
            description={action.description}
            href={action.href}
            icon={action.icon}
            iconClass={action.iconClass}
            iconWrapperClass={action.iconWrapperClass}
          />
        ))}
      </div>
    </section>
  );
}
