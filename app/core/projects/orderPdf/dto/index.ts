import {ProjectItemNeedProductionOrder} from "../../dto";

export type ProductionOrder = {
  orderNumber?: string; // "9183"
  date?: string; // "21-ene-26"
  projectName?: string; // "COOPIDROGAS"
  providerName?: string; // "MUNDIAL DE MALLAS Y ESTRUCTURAS"
  reference?: string; // "Sum. e Inst. Estructura Mixta ..."
  deliveryDateText?: string; // "28 de enero"
  installationMethod?: string; // "EMPOTRADO"
  color?: string; // "Blanco"
  observations?: string;
  elaboratedBy?: string; // "Sharon Solano"
  reviewedBy?: string;
  authorizedBy?: string;
  items: ProjectItemNeedProductionOrder[];
  fabricationCost: number;
  subtotal: number;
  iva: number;
  administrativeCost: number;
  impCost: number;
  utilCost: number;
  retentions: number;
  reteica: number;
  totalCost: number;
};

export type ProductionOrderInput = {
  color?: string; // "Blanco"
  observations?: string;
  deliveryDateText?: string;
};

export type ProductionOrderListItem = {
  id: string;
  projectId: string;
  version: number;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedBy: string | null;
  authorizedBy: string | null;
};

export type ProductionOrderRecord = {
  id: string;
  projectId: string;
  version: number;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
  payload: ProductionOrder;
};
