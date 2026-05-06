-- CreateEnum
CREATE TYPE "ProjectNoteType" AS ENUM ('GENERAL', 'PROCUREMENT', 'INSTALLATION', 'PRODUCTION', 'DELIVERY', 'CLIENT');

-- CreateEnum
CREATE TYPE "ProjectNoteLevel" AS ENUM ('INFO', 'WARNING', 'ISSUE', 'SUCCESS');

-- CreateTable
CREATE TABLE "ProjectNote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "type" "ProjectNoteType" NOT NULL DEFAULT 'GENERAL',
    "level" "ProjectNoteLevel" NOT NULL DEFAULT 'INFO',
    "pinned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectNote_projectId_createdAt_idx" ON "ProjectNote"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectNote_projectId_pinned_createdAt_idx" ON "ProjectNote"("projectId", "pinned", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectNote_projectId_type_idx" ON "ProjectNote"("projectId", "type");

-- CreateIndex
CREATE INDEX "ProjectNote_projectId_level_idx" ON "ProjectNote"("projectId", "level");

-- AddForeignKey
ALTER TABLE "ProjectNote" ADD CONSTRAINT "ProjectNote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectNote" ADD CONSTRAINT "ProjectNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
