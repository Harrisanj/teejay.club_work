import { getOnePostInput } from "../inputs/get-one-post.input";
import { select } from "../selector";

import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const getOne = t.procedure
  .input(getOnePostInput)
  .query(async ({ input: { id }, ctx: { user } }) => {
    return prisma.post.findFirstOrThrow({
      where: { id, isPublished: true },
      select: select(user?.id ?? -1),
    });
  });
