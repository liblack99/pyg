import type {UserRepoPort} from "../port/user.repo.port";

export class CreateUserUseCase {
  constructor(private users: UserRepoPort) {}
  execute(input: {email: string; name: string; roleId: string}) {
    return this.users.create(input);
  }
}
