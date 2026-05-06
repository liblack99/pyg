import {ClientRepoPort} from "../port/client.repo.port";
import {UpdateClientInput} from "../dto";

export class UpdateClientUseCase {
  constructor(private repo: ClientRepoPort) {}

  execute(id: string, input: UpdateClientInput) {
    return this.repo.update(id, input);
  }
}
