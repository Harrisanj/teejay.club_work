import { getInput } from "../inputs";

import { authGuard } from "@/guards";
import { t } from "@/trpc";
import { paginateNotifications } from "@/utilities";

export const get = t.procedure
  .use(authGuard)
  .input(getInput)
  .query(({ input: { ...pagination }, ctx: { user } }) => {
    return paginateNotifications({
      where: { userId: user.id },
      select: {
        id: true,
        readAt: true,
        replyToPostNotification: {
          select: {
            replyTo: { select: { id: true, title: true } },
            reply: {
              select: {
                id: true,
                author: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      ...pagination,
    });
  });
