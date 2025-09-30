/*
  Warnings:

  - You are about to drop the column `userId` on the `DeletionRequest` table. All the data in the column will be lost.
  - Added the required column `requestedByUserId` to the `DeletionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "synapse"."DeletionRequest" DROP CONSTRAINT "DeletionRequest_userId_fkey";

-- AlterTable
ALTER TABLE "synapse"."DeletionRequest" DROP COLUMN "userId",
ADD COLUMN     "requestedByUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "synapse"."DeletionRequest" ADD CONSTRAINT "DeletionRequest_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
