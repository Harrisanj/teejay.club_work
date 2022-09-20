import { Prisma } from "@teejay/prisma-client";

import { getCommentsByPostInput } from "../inputs";
import { select as selectComment } from "../selector";

import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const getByPost = t.procedure
  .input(getCommentsByPostInput)
  .query(async ({ input: { postId, commentId, parentId }, ctx: { user } }) => {
    const total = await prisma.comment.count({
      where: {
        post: {
          id: postId,
          isPublished: true,
        },
      },
    });

    let selectChildren;
    if (commentId && !parentId) {
      const items: [{ id: number }] = await prisma.$queryRaw`
        WITH RECURSIVE parentIds AS (
          SELECT "id", "parentId"
          FROM "Comment"
          WHERE "id" = ${commentId}
          UNION
            SELECT c."id", c."parentId"
            FROM "Comment" c
            INNER JOIN parentIds sc ON sc."parentId" = c."id"
        )
        SELECT "id"
        FROM parentIds;
      `;
      const ids = items.map((item) => item.id);
      for (let i = 0; i < ids.length - 3; i++) {
        const id = ids[i];
        const where = !i ? undefined : { id };
        selectChildren = Prisma.validator<Prisma.CommentSelect>()({
          children: {
            select: {
              ...selectComment(user?.id ?? -1),
              ...(selectChildren ?? {}),
            },
            where,
          },
        });
      }
    }

    const select = Prisma.validator<Prisma.CommentSelect>()({
      ...selectComment(user?.id ?? -1),
      children: {
        select: {
          ...selectComment(user?.id ?? -1),
          children: {
            select: {
              ...selectComment(user?.id ?? -1),
              ...selectChildren,
            },
          },
        },
      },
    });

    const data = await prisma.comment.findMany({
      select,
      where: {
        parentId,
        post: { id: postId, isPublished: true },
      },
      orderBy: { createdAt: "asc" },
    });

    return { meta: { total }, data };
  });
