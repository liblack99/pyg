import {ClientRepoPort} from "../port/client.repo.port";

export class DeleteClientUseCase {
  constructor(private repo: ClientRepoPort) {}

  async execute(id: string) {
    return this.repo.delete(id);
  }
}
