export interface RoleRepoPort {
  list(): Promise<{id: string; name: string}[]>;
}
