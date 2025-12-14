-- DropForeignKey
ALTER TABLE "Path" DROP CONSTRAINT "Path_ImageId_fkey";

-- DropForeignKey
ALTER TABLE "Point" DROP CONSTRAINT "Point_PathId_fkey";

-- DropForeignKey
ALTER TABLE "UserImage" DROP CONSTRAINT "UserImage_ImageId_fkey";

-- DropForeignKey
ALTER TABLE "UserImage" DROP CONSTRAINT "UserImage_UserId_fkey";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'untitled image';

-- AddForeignKey
ALTER TABLE "UserImage" ADD CONSTRAINT "UserImage_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserImage" ADD CONSTRAINT "UserImage_ImageId_fkey" FOREIGN KEY ("ImageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Path" ADD CONSTRAINT "Path_ImageId_fkey" FOREIGN KEY ("ImageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_PathId_fkey" FOREIGN KEY ("PathId") REFERENCES "Path"("id") ON DELETE CASCADE ON UPDATE CASCADE;
