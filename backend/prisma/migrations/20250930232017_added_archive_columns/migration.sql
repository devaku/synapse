-- AlterTable
ALTER TABLE "synapse"."Task" ADD COLUMN     "archivedByUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "synapse"."Task" ADD CONSTRAINT "Task_archivedByUserId_fkey" FOREIGN KEY ("archivedByUserId") REFERENCES "synapse"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
