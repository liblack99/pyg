import type {ProjectActivityRepoPort} from "../port/project-activity.repo.port";
import {ListProjectEventsUseCase} from "./list-project-events.usecase";
import {ListProjectAlertsUseCase} from "./list-project-alerts.usecase";
import {CreateProjectEventUseCase} from "./create-project-event.usecase";
import {CreateProjectAlertUseCase} from "./create-project-alert.usecase";
import {ResolveProjectAlertUseCase} from "./resolve-project-alert.usecase";
import {DismissProjectAlertUseCase} from "./dismiss-project-alert.usecase";
import {SyncProjectAlertsUseCase} from "./sync-project-alerts.usecase";

export {
  ListProjectEventsUseCase,
  ListProjectAlertsUseCase,
  CreateProjectEventUseCase,
  CreateProjectAlertUseCase,
  ResolveProjectAlertUseCase,
  DismissProjectAlertUseCase,
  SyncProjectAlertsUseCase,
};

export function makeProjectActivityUseCases(repo: ProjectActivityRepoPort) {
  return {
    listProjectEvents: new ListProjectEventsUseCase(repo),
    listProjectAlerts: new ListProjectAlertsUseCase(repo),
    createProjectEvent: new CreateProjectEventUseCase(repo),
    createProjectAlert: new CreateProjectAlertUseCase(repo),
    resolveProjectAlert: new ResolveProjectAlertUseCase(repo),
    dismissProjectAlert: new DismissProjectAlertUseCase(repo),
    syncProjectAlerts: new SyncProjectAlertsUseCase(repo),
  };
}
