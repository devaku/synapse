/*
  Warnings:

  - Added the required column `imageBlob` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "imageBlob" BYTEA NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL;
