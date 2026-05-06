import {ClientRepoPort} from "../port/client.repo.port";
import {CreateClientInput} from "../dto";

export class CreateClientUseCase {
  constructor(private repo: ClientRepoPort) {}

  async execute(input: CreateClientInput) {
    return this.repo.create(input);
  }
}
