"use client";

import {ProjectAlertsWidget} from "./ProjectAlertsWidget";
import {ProjectRecentActivityWidget} from "./ProjectRecentActivityWidget";
import {useProjectActivity} from "../../hooks/useProjectActivity";

export function ProjectActivityWidgets({projectId}: {projectId: string}) {
  const {
    loading,
    error,
    events,
    alerts,
    savingAlertId,
    resolveAlert,
    dismissAlert,
  } = useProjectActivity(projectId);

  return (
    <section className=" grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr,0.9fr]">
      <ProjectAlertsWidget
        alerts={alerts}
        loading={loading}
        error={error}
        savingAlertId={savingAlertId}
        onResolve={resolveAlert}
        onDismiss={dismissAlert}
      />

      <ProjectRecentActivityWidget
        events={events}
        loading={loading}
        error={error}
      />
    </section>
  );
}
