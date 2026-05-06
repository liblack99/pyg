import {ClientRepoPort} from "../port/client.repo.port";
import type {ListClientOutput, ListQueryClientInput} from "../dto";

export class ListClientsUseCase {
  constructor(private repo: ClientRepoPort) {}
  async execute(input: ListQueryClientInput): Promise<ListClientOutput> {
    return this.repo.listPaged(input);
  }
}
