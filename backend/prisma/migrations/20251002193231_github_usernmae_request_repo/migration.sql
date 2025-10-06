/*
  Warnings:

  - Added the required column `githubUsername` to the `RepoColaboratorRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "synapse"."RepoColaboratorRequest" ADD COLUMN     "githubUsername" TEXT NOT NULL;
