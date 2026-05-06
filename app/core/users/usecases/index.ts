// core/users/usecases/index.ts
import type {UserRepoPort} from "../port/user.repo.port";
import type {RoleRepoPort} from "../port/role.repo.port";

import {ListUsersUseCase} from "./list-users.usecase";
import {CreateUserUseCase} from "./create-user.usecase";
import {UpdateUserUseCase} from "./update-user.usecase";
import {DeleteUserUseCase} from "./delete-user.usecase";
import {GetUserByIdUseCase} from "./get-user-by-id.usecase";

/**
 * Factory para inyectar repositorios (ports/adapters).
 * Ventaja: las rutas no instancian lógica, solo piden usecases listos.
 */
export function makeUserUseCases(users: UserRepoPort, roles: RoleRepoPort) {
  return {
    listUsers: new ListUsersUseCase(users),
    createUser: new CreateUserUseCase(users),
    updateUser: new UpdateUserUseCase(users),
    deleteUser: new DeleteUserUseCase(users),
    getUserById: new GetUserByIdUseCase(users),

    // roles se usa en la ruta /roles, no necesariamente acá,
    // pero lo dejamos inyectado para mantener consistencia.
    roles,
  };
}
