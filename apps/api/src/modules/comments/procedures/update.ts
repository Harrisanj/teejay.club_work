import { TRPCError } from "@trpc/server";
import { addMinutes, isAfter } from "date-fns";

import { updateCommentInput } from "../inputs";
import { select } from "../selector";

import { blockGuard } from "@/guards";
import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const update = t.procedure
  .use(blockGuard)
  .input(updateCommentInput)
  .mutation(async ({ input: { id, ...input }, ctx: { user } }) => {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (isAfter(new Date(), addMinutes(comment.createdAt, 15))) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    return prisma.comment.update({
      where: { id },
      data: {
        ...input,
        editedAt: new Date(),
      },
      select: select(user?.id ?? -1),
    });
  });
