CREATE TABLE "ProjectNoteLike" (
  "noteId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProjectNoteLike_pkey" PRIMARY KEY ("noteId","userId")
);

CREATE TABLE "ProjectNoteReply" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "noteId" TEXT NOT NULL,
  "userId" TEXT,
  "content" TEXT NOT NULL,

  CONSTRAINT "ProjectNoteReply_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProjectNoteLike_userId_createdAt_idx" ON "ProjectNoteLike"("userId", "createdAt");
CREATE INDEX "ProjectNoteReply_noteId_createdAt_idx" ON "ProjectNoteReply"("noteId", "createdAt");
CREATE INDEX "ProjectNoteReply_userId_createdAt_idx" ON "ProjectNoteReply"("userId", "createdAt");

ALTER TABLE "ProjectNoteLike"
ADD CONSTRAINT "ProjectNoteLike_noteId_fkey"
FOREIGN KEY ("noteId") REFERENCES "ProjectNote"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectNoteLike"
ADD CONSTRAINT "ProjectNoteLike_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectNoteReply"
ADD CONSTRAINT "ProjectNoteReply_noteId_fkey"
FOREIGN KEY ("noteId") REFERENCES "ProjectNote"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectNoteReply"
ADD CONSTRAINT "ProjectNoteReply_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
