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
      include: {
        commentNotification: {
          include: {
            commenter: { select: { id: true, name: true } },
            post: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      ...pagination,
    });
  });
