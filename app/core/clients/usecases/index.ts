import {ClientRepoPort} from "../port/client.repo.port";
import {ListClientsUseCase} from "./list-clients.usecase";
import {CreateClientUseCase} from "./create-client.usecase";
import {UpdateClientUseCase} from "./update-client.usecase";
import {DeleteClientUseCase} from "./delete-client.usecase";
import {GetClientByIdUseCase} from "./get-client-by-id.usecase";
import {DashboardClientUseCase} from "./dashbord-cliente.usecase";

export function makeClientUseCases(clientRepo: ClientRepoPort) {
  return {
    listClients: new ListClientsUseCase(clientRepo),
    getClientById: new GetClientByIdUseCase(clientRepo),
    createClient: new CreateClientUseCase(clientRepo),
    updateClient: new UpdateClientUseCase(clientRepo),
    deleteClient: new DeleteClientUseCase(clientRepo),
    summary: new DashboardClientUseCase(clientRepo),
  };
}
