-- AlterTable
ALTER TABLE "synapse"."User" ADD COLUMN     "imageId" INTEGER;

-- CreateTable
CREATE TABLE "synapse"."Image" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "synapse"."ImagesAttachedToComments" (
    "imageId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "ImagesAttachedToComments_pkey" PRIMARY KEY ("imageId","commentId")
);

-- AddForeignKey
ALTER TABLE "synapse"."User" ADD CONSTRAINT "User_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "synapse"."Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."ImagesAttachedToComments" ADD CONSTRAINT "ImagesAttachedToComments_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "synapse"."Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."ImagesAttachedToComments" ADD CONSTRAINT "ImagesAttachedToComments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "synapse"."Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
