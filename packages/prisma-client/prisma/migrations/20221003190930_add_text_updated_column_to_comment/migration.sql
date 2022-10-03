-- AlterTable
ALTER TABLE "Comment" ADD COLUMN "textUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "Comment" SET "textUpdatedAt" = "createdAt";
