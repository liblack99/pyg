// app/core/users/ports/user.repo.port.ts
import type {UserWithRole, MeWithPerms} from "../dto";

export interface UserRepoPort {
  findById(id: string): Promise<UserWithRole | null>;
  list(): Promise<UserWithRole[]>;

  create(input: {
    email: string;
    name: string;
    roleId: string;
  }): Promise<UserWithRole>;
  update(
    id: string,
    input: {name?: string; roleId?: string},
  ): Promise<UserWithRole>;
  delete(id: string): Promise<void>;

  findByEmailWithPerms(email: string): Promise<MeWithPerms | null>;
  findByIdWithPerms(id: string): Promise<MeWithPerms | null>;
  updateLastLogin(id: string): void;
}
