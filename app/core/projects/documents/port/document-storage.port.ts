import type {DocumentUploadInput, DocumentUploadOutput} from "../dto";

export interface DocumentStoragePort {
  uploadFile(params: DocumentUploadInput): Promise<DocumentUploadOutput>;
  createFolder(params: {parentFolderId: string; name: string}): Promise<{
    folderId: string;
  }>;
}
