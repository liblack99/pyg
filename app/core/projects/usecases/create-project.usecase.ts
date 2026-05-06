import type {ProjectRepoPort} from "@/app/core/projects/port/project.repo.port";
import type {QuotationPdfRepo} from "@/app/core/quotations/pdf/port/quotationPdf.port";
import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";
import type {DocumentRepoPort} from "../documents/port/document-port";
import type {DocumentStoragePort} from "../documents/port/document-storage.port";
import {PROJECT_DOCUMENT_TYPE_LABELS} from "../documents/constants/project-document-type-labels";
import {getZohoProjectFolderPath} from "../documents/utils/zoho-folder-path";
import type {UpdateProjectInput} from "../dto";
import {logger} from "@/app/lib/logger";

export class CreateProjectUseCase {
  constructor(
    private readonly projectRepo: ProjectRepoPort,
    private readonly quotationRepo: QuotationRepoPort,
    private readonly quotationPdfRepo: QuotationPdfRepo,
    private readonly documentRepo: DocumentRepoPort,
    private readonly storage: DocumentStoragePort,
  ) {}

  async execute(
    quotationId: string,
    input: UpdateProjectInput,
    createdById: string,
  ) {
    const rootFolderId = process.env.ZOHO_ROOT_FOLDER_ID;

    if (!rootFolderId) {
      throw new Error("ZOHO_ROOT_FOLDER_ID is not configured");
    }

    const project = await this.projectRepo.create(
      quotationId,
      input,
      createdById,
    );

    const quotation = await this.quotationRepo.findById(quotationId);

    if (!quotation) {
      throw new Error("Quotation not found");
    }

    const pdfBytes =
      await this.quotationPdfRepo.quotationToPdfBuffer(quotation);
    const fileBuffer = Buffer.from(pdfBytes);

    const fileName = `${quotation.numberQuotation ?? "cotizacion"}.pdf`;
    const {yearFolderName, monthFolderName} = getZohoProjectFolderPath();

    logger.info("zoho.project.create", "Resolving project folder path", {
      rootFolderId,
      yearFolderName,
      monthFolderName,
      projectFolderName: project.code,
    });

    const yearFolder = await this.storage.createFolder({
      parentFolderId: rootFolderId,
      name: yearFolderName,
    });

    const monthFolder = await this.storage.createFolder({
      parentFolderId: yearFolder.folderId,
      name: monthFolderName,
    });

    const projectFolder = await this.storage.createFolder({
      parentFolderId: monthFolder.folderId,
      name: project.code,
    });

    const documentFolder = await this.storage.createFolder({
      parentFolderId: projectFolder.folderId,
      name: PROJECT_DOCUMENT_TYPE_LABELS["QUOTATION"],
    });

    logger.info("zoho.project.create", "Resolved project folder ids", {
      yearFolderId: yearFolder.folderId,
      monthFolderId: monthFolder.folderId,
      projectFolderId: projectFolder.folderId,
      documentFolderId: documentFolder.folderId,
    });

    const documentFolderName = PROJECT_DOCUMENT_TYPE_LABELS.QUOTATION;

    const upload = await this.storage.uploadFile({
      projectCode: project.code,
      documentType: documentFolderName,
      documentFolderId: documentFolder.folderId,
      fileBuffer,
      fileName,
      mimeType: "application/pdf",
    });

    await this.documentRepo.create({
      projectId: project.id,
      type: "QUOTATION",
      source: "GENERATED",
      status: "AVAILABLE",

      title: `Cotización ${quotation.numberQuotation ?? ""}`.trim(),
      description: "Documento generado automáticamente al crear el proyecto",
      isRequired: true,

      storageProvider: "ZOHO_WORKDRIVE",
      storageFileId: upload.fileId,
      storageFolderId: documentFolder.folderId,
      storageUrl: upload.url ?? null,

      fileName,
      originalFileName: fileName,
      mimeType: "application/pdf",
      fileSize: fileBuffer.byteLength,

      uploadedByUserId: createdById,
      metadata: {
        quotationId: quotation.id,
        quotationNumber: quotation.numberQuotation ?? null,
        generatedAutomatically: true,
      },
    });

    return project;
  }
}
