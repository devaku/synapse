-- CreateTable
CREATE TABLE "synapse"."RepoColaboratorRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "repoId" INTEGER NOT NULL,
    "permission" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RepoColaboratorRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "synapse"."RepoColaboratorRequest" ADD CONSTRAINT "RepoColaboratorRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
