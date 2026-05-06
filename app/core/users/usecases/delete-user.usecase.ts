import type {UserRepoPort} from "../port/user.repo.port";

export class DeleteUserUseCase {
  constructor(private users: UserRepoPort) {}

  execute(id: string) {
    return this.users.delete(id);
  }
}
