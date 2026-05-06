import type {UserRepoPort} from "../port/user.repo.port";

export class UpdateUserUseCase {
  constructor(private users: UserRepoPort) {}

  execute(id: string, input: {name?: string; roleId?: string}) {
    return this.users.update(id, input);
  }
}
