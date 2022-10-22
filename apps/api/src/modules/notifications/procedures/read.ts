import { TRPCError } from "@trpc/server";

import { readInput } from "../inputs";

import { authGuard } from "@/guards";
import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const read = t.procedure
  .use(authGuard)
  .input(readInput)
  .mutation(async ({ input: { ids }, ctx: { user } }) => {
    const readAt = new Date();
    await prisma.$transaction(
      ids.map((id) =>
        prisma.notification.updateMany({
          where: { id, userId: user.id },
          data: { readAt },
        })
      )
    );
  });
