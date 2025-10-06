/*
  Warnings:

  - You are about to drop the `_TeamToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "synapse"."_TeamToUser" DROP CONSTRAINT "_TeamToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "synapse"."_TeamToUser" DROP CONSTRAINT "_TeamToUser_B_fkey";

-- DropTable
DROP TABLE "synapse"."_TeamToUser";

-- CreateTable
CREATE TABLE "synapse"."TeamsUsersBelongTo" (
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "TeamsUsersBelongTo_pkey" PRIMARY KEY ("userId","teamId")
);

-- AddForeignKey
ALTER TABLE "synapse"."TeamsUsersBelongTo" ADD CONSTRAINT "TeamsUsersBelongTo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."TeamsUsersBelongTo" ADD CONSTRAINT "TeamsUsersBelongTo_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "synapse"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
