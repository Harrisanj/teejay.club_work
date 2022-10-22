ALTER TABLE "CommentNotification" RENAME CONSTRAINT "CommentNotification_pkey" TO "ReplyToPostNotification_pkey";
ALTER TABLE "CommentNotification" RENAME CONSTRAINT "CommentNotification_commentId_fkey" TO "ReplyToPostNotification_commentId_fkey";
ALTER TABLE "CommentNotification" RENAME CONSTRAINT "CommentNotification_commenterId_fkey" TO "ReplyToPostNotification_commenterId_fkey";
ALTER TABLE "CommentNotification" RENAME CONSTRAINT "CommentNotification_notificationId_fkey" TO "ReplyToPostNotification_notificationId_fkey";
ALTER TABLE "CommentNotification" RENAME CONSTRAINT "CommentNotification_postId_fkey" TO "ReplyToPostNotification_postId_fkey";
ALTER TABLE "CommentNotification" RENAME TO "ReplyToPostNotification";

ALTER INDEX "CommentNotification_notificationId_key" RENAME TO "ReplyToPostNotification_notificationId_key";

ALTER SEQUENCE "CommentNotification_id_seq" RENAME TO "ReplyToPostNotification_id_seq";