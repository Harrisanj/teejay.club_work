-- CreateTable
CREATE TABLE "ReplyToCommentNotification" (
    "id" SERIAL NOT NULL,
    "notificationId" INTEGER NOT NULL,
    "replyToId" INTEGER NOT NULL,
    "replyId" INTEGER NOT NULL,

    CONSTRAINT "ReplyToCommentNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReplyToCommentNotification_notificationId_key" ON "ReplyToCommentNotification"("notificationId");

-- AddForeignKey
ALTER TABLE "ReplyToCommentNotification" ADD CONSTRAINT "ReplyToCommentNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyToCommentNotification" ADD CONSTRAINT "ReplyToCommentNotification_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyToCommentNotification" ADD CONSTRAINT "ReplyToCommentNotification_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
