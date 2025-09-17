/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Task` table. All the data in the column will be lost.
  - Added the required column `createdByUserId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "synapse"."Task" DROP CONSTRAINT "Task_assignedTo_fkey";

-- DropForeignKey
ALTER TABLE "synapse"."Task" DROP CONSTRAINT "Task_createdBy_fkey";

-- AlterTable
ALTER TABLE "synapse"."Task" DROP COLUMN "assignedTo",
DROP COLUMN "createdBy",
ADD COLUMN     "assignedToUserId" INTEGER,
ADD COLUMN     "createdByUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "synapse"."Task" ADD CONSTRAINT "Task_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."Task" ADD CONSTRAINT "Task_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "synapse"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
