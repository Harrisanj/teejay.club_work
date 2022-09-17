import { getCommentsByPostInput } from "../inputs";
import { selectWithChildren } from "../selector";

import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const getByPost = t.procedure
  .input(getCommentsByPostInput)
  .query(async ({ input: { postId, parentId }, ctx: { user } }) => {
    const total = await prisma.comment.count({
      where: { post: { id: postId, isPublished: true } },
    });

    const data = await prisma.comment.findMany({
      select: selectWithChildren(user?.id ?? -1),
      where: {
        post: { id: postId, isPublished: true },
        parentId,
      },
      orderBy: { createdAt: "asc" },
    });

    return { meta: { total }, data };
  });
