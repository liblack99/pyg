import {UploadProjectDocumentUseCase} from "./upload-document-usecase";
import {ListProjectDocumentsUseCase} from "./list-project-document-usecase";
import {DocumentRepoPort} from "../port/document-port";
import {DocumentStoragePort} from "../port/document-storage.port";

export function makeDocumentProjectUseCase(
  documentRepo: DocumentRepoPort,
  storageRepo: DocumentStoragePort,
) {
  return {
    uploadDocument: new UploadProjectDocumentUseCase(documentRepo, storageRepo),
    listDocuments: new ListProjectDocumentsUseCase(documentRepo),
  };
}
