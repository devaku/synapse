/*
  Warnings:

  - You are about to drop the column `assignedToUserId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[keycloakId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "synapse"."Task" DROP CONSTRAINT "Task_assignedToUserId_fkey";

-- AlterTable
ALTER TABLE "synapse"."Task" DROP COLUMN "assignedToUserId";

-- AlterTable
ALTER TABLE "synapse"."User" DROP COLUMN "createdAt",
ADD COLUMN     "lastActivity" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "synapse"."session";

-- CreateTable
CREATE TABLE "synapse"."Session" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "synapse"."TaskVisibleToUsers" (
    "taskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TaskVisibleToUsers_pkey" PRIMARY KEY ("userId","taskId")
);

-- CreateTable
CREATE TABLE "synapse"."TaskVisibleToTeams" (
    "taskId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "TaskVisibleToTeams_pkey" PRIMARY KEY ("teamId","taskId")
);

-- CreateTable
CREATE TABLE "synapse"."TaskHiddenFromUsers" (
    "taskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TaskHiddenFromUsers_pkey" PRIMARY KEY ("userId","taskId")
);

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "synapse"."Session"("expire");

-- CreateIndex
CREATE UNIQUE INDEX "User_keycloakId_key" ON "synapse"."User"("keycloakId");

-- AddForeignKey
ALTER TABLE "synapse"."TaskVisibleToUsers" ADD CONSTRAINT "TaskVisibleToUsers_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "synapse"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."TaskVisibleToUsers" ADD CONSTRAINT "TaskVisibleToUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."TaskVisibleToTeams" ADD CONSTRAINT "TaskVisibleToTeams_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "synapse"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."TaskVisibleToTeams" ADD CONSTRAINT "TaskVisibleToTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "synapse"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."TaskHiddenFromUsers" ADD CONSTRAINT "TaskHiddenFromUsers_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "synapse"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."TaskHiddenFromUsers" ADD CONSTRAINT "TaskHiddenFromUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
