export interface Review {
  id: string;
  title: string;
  description: string;
}

export const reviewsMock: Review[] = [
  {
    id: "r1",
    title: "Garantía estándar",
    description: "Se garantiza el producto por 12 meses contra defectos.",
  },
  {
    id: "r2",
    title: "Entrega inmediata",
    description:
      "El proveedor entregará el producto en un plazo máximo de 48 horas.",
  },
  {
    id: "r3",
    title: "Instalación incluida",
    description: "Incluye instalación y puesta en marcha sin costo adicional.",
  },
];
