import type {
  ClientListItem,
  CreateClientInput,
  UpdateClientInput,
  CreateClientResult,
  UpdateClientResult,
  ListQueryClientInput,
  ListClientOutput,
  ClientDashboardStats,
} from "../dto";

export interface ClientRepoPort {
  listPaged(input: ListQueryClientInput): Promise<ListClientOutput>;
  findById(id: string): Promise<ClientListItem | null>;
  create(input: CreateClientInput): Promise<CreateClientResult>;
  update(id: string, input: UpdateClientInput): Promise<UpdateClientResult>;
  delete(id: string): Promise<void>;
  getClientMetrics(): Promise<ClientDashboardStats>;
}
