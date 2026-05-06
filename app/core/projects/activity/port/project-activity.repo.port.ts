import type {
  CreateProjectAlertInput,
  CreateProjectEventInput,
  ListProjectAlertsQuery,
  ListProjectEventsQuery,
  ProjectAlertView,
  ProjectEventView,
} from "../dto";

export interface ProjectActivityRepoPort {
  listEvents: (
    projectId: string,
    query?: ListProjectEventsQuery,
  ) => Promise<ProjectEventView[]>;
  listAlerts: (
    projectId: string,
    query?: ListProjectAlertsQuery,
  ) => Promise<ProjectAlertView[]>;
  createEvent: (
    projectId: string,
    input: CreateProjectEventInput,
  ) => Promise<ProjectEventView>;
  createAlert: (
    projectId: string,
    input: CreateProjectAlertInput,
  ) => Promise<ProjectAlertView>;
  resolveAlert: (alertId: string) => Promise<ProjectAlertView>;
  dismissAlert: (alertId: string) => Promise<ProjectAlertView>;
  syncAlerts: (projectId: string) => Promise<ProjectAlertView[]>;
}
