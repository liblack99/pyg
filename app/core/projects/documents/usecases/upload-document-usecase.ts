import type {DocumentStoragePort} from "../port/document-storage.port";
import type {ProjectDocumentType} from "../dto";
import type {DocumentRepoPort} from "../port/document-port";
import {PROJECT_DOCUMENT_TYPE_LABELS} from "../constants/project-document-type-labels";
import {getZohoProjectFolderPath} from "../utils/zoho-folder-path";
import {logger} from "@/app/lib/logger";

type UploadProjectDocumentParams = {
  projectId: string;
  projectCode: string;
  type: ProjectDocumentType;
  title: string;
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  fileSize: number;
  uploadedByUserId?: string | null;
  description?: string | null;
  isRequired?: boolean;
};

export class UploadProjectDocumentUseCase {
  constructor(
    private readonly repo: DocumentRepoPort,
    private readonly storage: DocumentStoragePort,
  ) {}

  async execute(params: UploadProjectDocumentParams) {
    const rootFolderId = process.env.ZOHO_ROOT_FOLDER_ID;

    if (!rootFolderId) {
      throw new Error(
        "ZOHO_WORKDRIVE_PROJECTS_ROOT_FOLDER_ID is not configured",
      );
    }
    const folderName = PROJECT_DOCUMENT_TYPE_LABELS[params.type];
    const {yearFolderName, monthFolderName} = getZohoProjectFolderPath();

    logger.info("zoho.document.upload", "Resolving document folder path", {
      rootFolderId,
      yearFolderName,
      monthFolderName,
      projectFolderName: params.projectCode,
      documentFolderName: folderName,
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
      name: params.projectCode,
    });

    const documentFolder = await this.storage.createFolder({
      parentFolderId: projectFolder.folderId,
      name: folderName,
    });

    logger.info("zoho.document.upload", "Resolved document folder ids", {
      yearFolderId: yearFolder.folderId,
      monthFolderId: monthFolder.folderId,
      projectFolderId: projectFolder.folderId,
      documentFolderId: documentFolder.folderId,
    });

    const upload = await this.storage.uploadFile({
      projectCode: params.projectCode,
      documentType: params.type,
      documentFolderId: documentFolder.folderId,
      fileBuffer: params.fileBuffer,
      fileName: params.fileName,
      mimeType: params.mimeType,
    });

    const document = await this.repo.create({
      projectId: params.projectId,
      type: params.type,
      source: "UPLOADED",
      status: "AVAILABLE",

      title: params.title,
      description: params.description ?? null,
      isRequired: params.isRequired ?? true,

      storageProvider: "ZOHO_WORKDRIVE",
      storageFileId: upload.fileId,
      storageFolderId: documentFolder.folderId,
      storageUrl: upload.url ?? null,

      fileName: params.fileName,
      originalFileName: params.fileName,
      mimeType: params.mimeType,
      fileSize: params.fileSize,

      uploadedByUserId: params.uploadedByUserId ?? null,
      metadata: null,
    });

    return document;
  }
}
