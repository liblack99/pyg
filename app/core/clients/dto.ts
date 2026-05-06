export interface Client {
  id: string;
  name: string;
  documentType: string;
  documentNumber: string;

  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  department?: string | null;

  contactName1?: string | null;
  contactRole1?: string | null;
  contactPhone1?: string | null;

  contactName2?: string | null;
  contactRole2?: string | null;
  contactPhone2?: string | null;
}

export interface ClientListItem extends Client {
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DefaultEditClientValues = Client;

export type UpdateClientInput = Partial<Client>;

export type CreateClientInput = Omit<Client, "id"> & {
  createdById: string;
};

export interface CreateClientResult {
  id: string;
  name: string;
  documentType: string;
  documentNumber: string;
}

export interface UpdateClientResult {
  name: string;
}
export interface ListQueryClientInput {
  search?: string;
  limit?: number;
  cursor?: string;
}

export interface ListClientOutput {
  items: ClientListItem[];
  nextCursor: string | null;
}
export interface ClientDashboardStats {
  totalClients: {
    count: number;
    subtext: string;
    isPositive: boolean;
  };
  activeClients: {
    count: number;
    subtext: string;
    isPositive: boolean;
  };
  totalRevenue: {
    amount: number;
    formatted: string;
    subtext: string;
    isPositive: boolean;
  };
  activeProjects: {
    count: number;
    subtext: string;
    isPositive: boolean;
  };
}
export interface GrowthResult {
  current: number;
  previous: number;
}
