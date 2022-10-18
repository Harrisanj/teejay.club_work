import { TRPCError } from "@trpc/server";

import { readInput } from "../inputs";

import { authGuard } from "@/guards";
import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const read = t.procedure
  .use(authGuard)
  .input(readInput)
  .mutation(async ({ input: { id }, ctx: { user } }) => {
    const notification = await prisma.notification.findFirst({
      where: { id, userId: user.id },
    });

    if (!notification) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  });
