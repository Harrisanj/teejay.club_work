import { createCommentInput } from "../inputs";
import { select } from "../selector";

import { blockGuard } from "@/guards";
import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const create = t.procedure
  .use(blockGuard)
  .input(createCommentInput)
  .mutation(({ input, ctx: { user } }) => {
    return prisma.comment.create({
      data: {
        ...input,
        authorId: user.id,
      },
      select: select(user?.id ?? -1),
    });
  });
