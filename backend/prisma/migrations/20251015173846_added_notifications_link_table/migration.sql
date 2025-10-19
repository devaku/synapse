/*
  Warnings:

  - You are about to drop the column `teamId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "synapse"."Notification" DROP CONSTRAINT "Notification_teamId_fkey";

-- DropForeignKey
ALTER TABLE "synapse"."Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "synapse"."Notification" DROP COLUMN "teamId",
DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "synapse"."NotificationForUsers" (
    "userId" INTEGER NOT NULL,
    "notificationId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationForUsers_pkey" PRIMARY KEY ("userId","notificationId")
);

-- AddForeignKey
ALTER TABLE "synapse"."NotificationForUsers" ADD CONSTRAINT "NotificationForUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."NotificationForUsers" ADD CONSTRAINT "NotificationForUsers_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "synapse"."Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
