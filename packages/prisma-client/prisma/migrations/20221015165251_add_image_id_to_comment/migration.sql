/*
  Warnings:

  - You are about to drop the column `textUpdatedAt` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "textUpdatedAt",
ADD COLUMN     "imageId" TEXT,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
