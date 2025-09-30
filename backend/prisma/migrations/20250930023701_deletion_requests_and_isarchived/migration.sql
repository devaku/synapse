-- AlterTable
ALTER TABLE "synapse"."Task" ADD COLUMN     "isArchived" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "synapse"."DeletionRequest" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DeletionRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "synapse"."DeletionRequest" ADD CONSTRAINT "DeletionRequest_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "synapse"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."DeletionRequest" ADD CONSTRAINT "DeletionRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
