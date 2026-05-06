// app/core/projects/documents/infra/project-document.prisma.repo.ts

import {prisma} from "@/app/lib/prisma";
import {Prisma} from "@/app/generated/prisma/client";
import type {
  CreateProjectDocumentInput,
  UpdateProjectDocumentInput,
} from "@/app/core/projects/documents/dto";
import type {ProjectDocumentEntity} from "@/app/core/projects/documents/dto";
import type {DocumentRepoPort} from "@/app/core/projects/documents/port/document-port";

function mapProjectDocument(doc: ProjectDocumentEntity): ProjectDocumentEntity {
  return {
    id: doc.id,
    projectId: doc.projectId,
    type: doc.type,
    source: doc.source,
    status: doc.status,

    title: doc.title,
    description: doc.description ?? null,
    isRequired: doc.isRequired,

    storageProvider: doc.storageProvider ?? null,
    storageFileId: doc.storageFileId ?? null,
    storageFolderId: doc.storageFolderId ?? null,
    storageUrl: doc.storageUrl ?? null,

    fileName: doc.fileName ?? null,
    originalFileName: doc.originalFileName ?? null,
    mimeType: doc.mimeType ?? null,
    fileSize: doc.fileSize ?? null,

    generatedFrom: doc.generatedFrom ?? null,
    uploadedByUserId: doc.uploadedByUserId ?? null,

    issuedAt: doc.issuedAt ?? null,
    expiresAt: doc.expiresAt ?? null,

    metadata: doc.metadata,

    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const projectDocumentRepo: DocumentRepoPort = {
  async create(
    input: CreateProjectDocumentInput,
  ): Promise<ProjectDocumentEntity> {
    const created = await prisma.projectDocument.create({
      data: {
        projectId: input.projectId,
        type: input.type,
        source: input.source,
        status: input.status ?? "AVAILABLE",

        title: input.title,
        description: input.description ?? null,
        isRequired: input.isRequired ?? true,

        storageProvider: input.storageProvider ?? null,
        storageFileId: input.storageFileId ?? null,
        storageFolderId: input.storageFolderId ?? null,
        storageUrl: input.storageUrl ?? null,

        fileName: input.fileName ?? null,
        originalFileName: input.originalFileName ?? null,
        mimeType: input.mimeType ?? null,
        fileSize: input.fileSize ?? null,

        generatedFrom: input.generatedFrom ?? null,
        uploadedByUserId: input.uploadedByUserId ?? null,

        issuedAt: input.issuedAt ?? null,
        expiresAt: input.expiresAt ?? null,

        metadata: (input.metadata as Prisma.InputJsonValue) ?? null,
      },
    });

    return mapProjectDocument(created);
  },

  async update(
    id: string,
    input: UpdateProjectDocumentInput,
  ): Promise<ProjectDocumentEntity> {
    const updated = await prisma.projectDocument.update({
      where: {id},
      data: {
        ...input,
        metadata: input.metadata as Prisma.InputJsonValue,
      },
    });

    return mapProjectDocument(updated);
  },

  async findById(id: string): Promise<ProjectDocumentEntity | null> {
    const doc = await prisma.projectDocument.findUnique({
      where: {id},
    });

    return doc ? mapProjectDocument(doc) : null;
  },

  async listByProject(projectId: string): Promise<ProjectDocumentEntity[]> {
    const docs = await prisma.projectDocument.findMany({
      where: {projectId},
      orderBy: [{createdAt: "desc"}],
    });

    return docs.map(mapProjectDocument);
  },
};
