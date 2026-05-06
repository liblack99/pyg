import {ClientRepoPort} from "../port/client.repo.port";
// ajusta path

export class GetClientByIdUseCase {
  constructor(private readonly repo: ClientRepoPort) {}

  async execute(input: {id: string}) {
    const user = await this.repo.findById(input.id);

    return user;
  }
}
