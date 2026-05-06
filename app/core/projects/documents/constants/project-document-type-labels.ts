import {ProjectDocumentType} from "@/app/generated/prisma/enums";

export const PROJECT_DOCUMENT_TYPE_LABELS: Record<ProjectDocumentType, string> =
  {
    QUOTATION: "Cotización",
    CLIENT_RUT: "RUT del Cliente",
    CLIENT_ID: "Documento de Identidad del Cliente",
    CHAMBER_OF_COMMERCE: "Cámara de Comercio",
    LEGAL_REP_ID: "Documento del Representante Legal",
    CLIENT_REGISTRATION: "Registro del Cliente",
    WORK_CONTRACT: "Contrato de Obra",
    PURCHASE_ORDER: "Orden de Compra",
    START_ACT: "Acta de Inicio",
    PAYMENT_PROOF: "Comprobante de Pago",
    POLICY: "Póliza",
    DELIVERY_NOTE: "Remisión / Nota de Entrega",
    DELIVERY_ACT: "Acta de Entrega",
    WARRANTY_CERTIFICATE: "Certificado de Garantía",
    INSTALLATION_PHOTO: "Foto de instalación",
    INSTALLATION_RECORD: "Acta de instalación",
    INSTALLATION_SUPPORT: "Soporte de instalación",
    WARRANTY_EVIDENCE: "Evidencia de garantía",
    WARRANTY_SUPPORT: "Soporte de garantía",
    FINANCE_SUPPORT: "Soporte financiero",
  };
