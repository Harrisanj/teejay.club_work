import { getCommentsByPostInput } from "../inputs";
import { select } from "../selector";

import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const getByPost = t.procedure
  .input(getCommentsByPostInput)
  .query(async ({ input: { postId, lastCreatedAt }, ctx: { user } }) => {
    const where = {
      post: { id: postId, isPublished: true },
    };
    const total = await prisma.comment.count({ where });
    const data = await prisma.comment.findMany({
      select: select(user?.id ?? -1),
      where: {
        ...where,
        createdAt: { gt: lastCreatedAt },
      },
      orderBy: { createdAt: "asc" },
    });

    return { meta: { total }, data };
  });
