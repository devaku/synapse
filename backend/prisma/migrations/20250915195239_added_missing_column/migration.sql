/*
  Warnings:

  - You are about to drop the column `phone` on the `Team` table. All the data in the column will be lost.
  - Made the column `message` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taskId` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `priority` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Team` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "synapse_schema"."Comment" DROP CONSTRAINT "Comment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "synapse_schema"."Logs" DROP CONSTRAINT "Logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "synapse_schema"."Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "synapse_schema"."Comment" ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "taskId" SET NOT NULL;

-- AlterTable
ALTER TABLE "synapse_schema"."Logs" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "synapse_schema"."Notification" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "synapse_schema"."Task" ADD COLUMN     "priority" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "completeDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "synapse_schema"."Team" DROP COLUMN "phone",
ALTER COLUMN "name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "synapse_schema"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "synapse_schema"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse_schema"."Logs" ADD CONSTRAINT "Logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "synapse_schema"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse_schema"."Comment" ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "synapse_schema"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
