DELETE
FROM "PostVote"
WHERE "id" IN
        (SELECT "PostVote"."id"
         FROM "PostVote"
         INNER JOIN "Post" ON "PostVote"."postId" = "Post"."id"
         AND "PostVote"."userId" = "Post"."authorId");


DELETE
FROM "CommentVote"
WHERE "id" IN
        (SELECT "CommentVote"."id"
         FROM "CommentVote"
         INNER JOIN "Comment" ON "CommentVote"."commentId" = "Comment"."id"
         AND "CommentVote"."userId" = "Comment"."authorId");

