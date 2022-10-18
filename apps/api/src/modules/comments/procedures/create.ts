import { createCommentInput } from "../inputs";
import { select } from "../selector";

import { blockGuard } from "@/guards";
import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const create = t.procedure
  .use(blockGuard)
  .input(createCommentInput)
  .mutation(async ({ input, ctx: { user } }) => {
    const comment = await prisma.comment.create({
      data: {
        ...input,
        authorId: user.id,
      },
      select: select(user?.id ?? -1),
    });

    const post = await prisma.post.findFirst({
      where: { id: input.postId },
      select: { id: true, authorId: true },
    });

    if (post && post.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          commentNotification: {
            create: {
              postId: post.id,
              commentId: comment.id,
              commenterId: user.id,
            },
          },
        },
      });
    }

    return comment;
  });
