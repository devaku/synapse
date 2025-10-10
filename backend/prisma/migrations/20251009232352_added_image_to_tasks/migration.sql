/*
  Warnings:

  - You are about to drop the column `image` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "synapse"."Task" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "synapse"."ImagesAttachedToTasks" (
    "imageId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "ImagesAttachedToTasks_pkey" PRIMARY KEY ("imageId","taskId")
);

-- AddForeignKey
ALTER TABLE "synapse"."ImagesAttachedToTasks" ADD CONSTRAINT "ImagesAttachedToTasks_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "synapse"."Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."ImagesAttachedToTasks" ADD CONSTRAINT "ImagesAttachedToTasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "synapse"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
