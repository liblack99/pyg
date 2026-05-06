import {Prisma} from "@/app/generated/prisma/client";

export interface DocumentUploadInput {
  projectCode: string;
  documentType: string;
  documentFolderId: string;
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
}
export interface DocumentUploadOutput {
  fileId: string;
  url?: string;
  projectFolderId: string;
  documentFolderId: string;
}

// app/core/projects/documents/domain/project-document.types.ts

export const PROJECT_DOCUMENT_TYPES = [
  "QUOTATION",
  "CLIENT_RUT",
  "CLIENT_ID",
  "CHAMBER_OF_COMMERCE",
  "LEGAL_REP_ID",
  "CLIENT_REGISTRATION",
  "WORK_CONTRACT",
  "PURCHASE_ORDER",
  "START_ACT",
  "PAYMENT_PROOF",
  "POLICY",
  "DELIVERY_NOTE",
  "DELIVERY_ACT",
  "WARRANTY_CERTIFICATE",
  "INSTALLATION_PHOTO",
  "INSTALLATION_RECORD",
  "INSTALLATION_SUPPORT",
  "WARRANTY_EVIDENCE",
  "WARRANTY_SUPPORT",
  "FINANCE_SUPPORT",
] as const;

export type ProjectDocumentType = (typeof PROJECT_DOCUMENT_TYPES)[number];

export const PROJECT_DOCUMENT_SOURCES = ["GENERATED", "UPLOADED"] as const;
export type ProjectDocumentSource = (typeof PROJECT_DOCUMENT_SOURCES)[number];

export const PROJECT_DOCUMENT_STATUSES = [
  "PENDING",
  "AVAILABLE",
  "REPLACED",
  "VOID",
] as const;

export type ProjectDocumentStatus = (typeof PROJECT_DOCUMENT_STATUSES)[number];

export const STORAGE_PROVIDERS = ["ZOHO_WORKDRIVE"] as const;
export type StorageProvider = (typeof STORAGE_PROVIDERS)[number];

export type ProjectDocumentEntity = {
  id: string;
  projectId: string;
  type: ProjectDocumentType;
  source: ProjectDocumentSource;
  status: ProjectDocumentStatus;

  title: string;
  description: string | null;
  isRequired: boolean;

  storageProvider: StorageProvider | null;
  storageFileId: string | null;
  storageFolderId: string | null;
  storageUrl: string | null;

  fileName: string | null;
  originalFileName: string | null;
  mimeType: string | null;
  fileSize: number | null;

  generatedFrom: string | null;
  uploadedByUserId: string | null;

  issuedAt: Date | null;
  expiresAt: Date | null;

  metadata: Prisma.InputJsonValue | null;

  createdAt: Date;
  updatedAt: Date;
};

export type CreateProjectDocumentInput = {
  projectId: string;

  type: ProjectDocumentType;
  source: ProjectDocumentSource;
  status?: ProjectDocumentStatus;

  title: string;
  description?: string | null;
  isRequired?: boolean;

  storageProvider?: StorageProvider | null;
  storageFileId?: string | null;
  storageFolderId?: string | null;
  storageUrl?: string | null;

  fileName?: string | null;
  originalFileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;

  generatedFrom?: string | null;
  uploadedByUserId?: string | null;

  issuedAt?: Date | null;
  expiresAt?: Date | null;

  metadata?: Prisma.InputJsonValue | null;
};

export type UpdateProjectDocumentInput = Partial<
  Omit<CreateProjectDocumentInput, "projectId">
>;

export type ProjectDocumentListItem = ProjectDocumentEntity;
