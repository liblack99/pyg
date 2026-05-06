import {ClientRepoPort} from "../port/client.repo.port";

export class DashboardClientUseCase {
  constructor(private readonly repo: ClientRepoPort) {}

  async execute() {
    const user = await this.repo.getClientMetrics();

    return user;
  }
}
