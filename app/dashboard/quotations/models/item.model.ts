export interface Item {
  code: string; // REF: PYG MET52
  productName: string;
  productId: string; // ID del producto asociado
  description?: string | null; // Descripción detallada
  unit: string; // und, m², m, hr, etc.
  quantity: number; // Cantidad solicitada
  unitPrice: number; // Precio base por unidad
  adminPercent: number; // Porcentaje de administración
  imprPercent: number; // Porcentaje de imprevistos
  utilPercent: number; // Porcentaje de utilidad
  ivaPercent: number; // Porcentaje de IVA
}
