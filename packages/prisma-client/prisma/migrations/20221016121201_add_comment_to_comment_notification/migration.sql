/*
  Warnings:

  - Added the required column `commentId` to the `CommentNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentNotification" ADD COLUMN     "commentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CommentNotification" ADD CONSTRAINT "CommentNotification_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
