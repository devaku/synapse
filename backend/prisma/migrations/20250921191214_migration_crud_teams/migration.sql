/*
  Warnings:

  - Added the required column `createdBy` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "synapse"."Team" ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "synapse"."Team" ADD CONSTRAINT "Team_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
