import type {UserRepoPort} from "../port/user.repo.port";

export class ListUsersUseCase {
  constructor(private users: UserRepoPort) {}
  execute() {
    return this.users.list();
  }
}
