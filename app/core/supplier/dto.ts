export interface Supplier {
  id: string;
  name: string;
  city: string | null;
  contactName: string | null;
  phone: string | null;
  invoiceRequired: boolean;
  requiresProductionOrder: boolean;
  notes: string | null;
}
