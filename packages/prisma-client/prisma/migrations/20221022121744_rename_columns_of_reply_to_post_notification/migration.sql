ALTER TABLE "ReplyToPostNotification" RENAME CONSTRAINT "ReplyToPostNotification_commentId_fkey" TO "ReplyToPostNotification_replyId_fkey";
ALTER TABLE "ReplyToPostNotification" RENAME CONSTRAINT "ReplyToPostNotification_postId_fkey" TO "ReplyToPostNotification_replyToId_fkey";
ALTER TABLE "ReplyToPostNotification" DROP CONSTRAINT "ReplyToPostNotification_commenterId_fkey";

ALTER TABLE "ReplyToPostNotification" RENAME COLUMN "commentId" TO "replyId";
ALTER TABLE "ReplyToPostNotification" RENAME COLUMN "postId" TO "replyToId";
ALTER TABLE "ReplyToPostNotification" DROP COLUMN "commenterId";
