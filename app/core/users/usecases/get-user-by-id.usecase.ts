// core/users/usecases/get-user-by-id.usecase.ts
import type {UserRepoPort} from "../port/user.repo.port";
// ajusta path

export class GetUserByIdUseCase {
  constructor(private readonly userRepo: UserRepoPort) {}

  async execute(input: {id: string}) {
    const user = await this.userRepo.findById(input.id);

    return user;
  }
}
