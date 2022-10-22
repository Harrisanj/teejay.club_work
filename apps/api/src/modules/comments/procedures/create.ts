import { TRPCError } from "@trpc/server";

import { createCommentInput } from "../inputs";
import { select } from "../selector";

import { blockGuard } from "@/guards";
import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const create = t.procedure
  .use(blockGuard)
  .input(createCommentInput)
  .mutation(async ({ input, ctx: { user } }) => {
    const post = await prisma.post.findUnique({
      where: { id: input.postId },
      select: { id: true, authorId: true },
    });

    const parentComment = input.parentId
      ? await prisma.comment.findUnique({
          where: { id: input.parentId },
          select: { id: true, authorId: true },
        })
      : undefined;

    if (post === null || parentComment === null) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const comment = await prisma.comment.create({
      data: {
        ...input,
        authorId: user.id,
      },
      select: select(user?.id ?? -1),
    });

    if (!parentComment && post.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          replyToPostNotification: {
            create: {
              replyToId: post.id,
              replyId: comment.id,
            },
          },
        },
      });
    }

    if (parentComment && parentComment.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: parentComment.authorId,
          replyToCommentNotification: {
            create: {
              replyToId: parentComment.id,
              replyId: comment.id,
            },
          },
        },
      });
    }

    return comment;
  });
