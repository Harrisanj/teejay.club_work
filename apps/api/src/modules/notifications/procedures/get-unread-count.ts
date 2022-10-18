import { authGuard } from "@/guards";
import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const getUnreadCount = t.procedure
  .use(authGuard)
  .query(({ ctx: { user } }) => {
    return prisma.notification.count({
      where: {
        userId: user.id,
        readAt: null,
      },
    });
  });
