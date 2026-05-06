import type {ProjectDocumentType} from "@/app/core/projects/documents/dto";

export type DocumentGroupItem = {
  type: ProjectDocumentType;
  label: string;
  mode: "UPLOAD" | "GENERATE" | "MIXED";
};

export type DocumentGroup = {
  key: string;
  title: string;
  items: DocumentGroupItem[];
};

export const DOCUMENT_GROUPS: DocumentGroup[] = [
  {
    key: "CLIENTE",
    title: "Cliente",
    items: [
      {type: "CLIENT_RUT", label: "RUT del cliente", mode: "UPLOAD"},
      {type: "CLIENT_ID", label: "Cédula del cliente", mode: "UPLOAD"},
      {
        type: "CHAMBER_OF_COMMERCE",
        label: "Cámara de comercio",
        mode: "UPLOAD",
      },
      {
        type: "LEGAL_REP_ID",
        label: "Cédula representante legal",
        mode: "UPLOAD",
      },
      {
        type: "CLIENT_REGISTRATION",
        label: "Registro de cliente",
        mode: "UPLOAD",
      },
    ],
  },
  {
    key: "COMERCIALES",
    title: "Comerciales",
    items: [
      {type: "QUOTATION", label: "Cotización", mode: "MIXED"},
      {type: "PURCHASE_ORDER", label: "Orden de compra", mode: "UPLOAD"},
    ],
  },
  {
    key: "EJECUCION",
    title: "Ejecución",
    items: [
      {type: "WORK_CONTRACT", label: "Contrato de obra", mode: "MIXED"},
      {type: "START_ACT", label: "Acta de inicio", mode: "MIXED"},
    ],
  },
  {
    key: "FINANCIEROS",
    title: "Financieros",
    items: [
      {type: "PAYMENT_PROOF", label: "Soporte de pago", mode: "UPLOAD"},
      {type: "POLICY", label: "Póliza", mode: "MIXED"},
    ],
  },
  {
    key: "CIERRE",
    title: "Cierre",
    items: [
      {type: "DELIVERY_NOTE", label: "Remisión", mode: "UPLOAD"},
      {type: "DELIVERY_ACT", label: "Acta de entrega", mode: "UPLOAD"},
      {
        type: "WARRANTY_CERTIFICATE",
        label: "Certificado de garantía",
        mode: "UPLOAD",
      },
    ],
  },
];
