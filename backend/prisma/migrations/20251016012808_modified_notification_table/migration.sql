/*
  Warnings:

  - You are about to drop the column `name` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `createdByUserId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payload` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "synapse"."Notification" DROP COLUMN "name",
ADD COLUMN     "createdByUserId" INTEGER NOT NULL,
ADD COLUMN     "payload" JSONB NOT NULL,
ADD COLUMN     "title" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "synapse"."Notification" ADD CONSTRAINT "Notification_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
