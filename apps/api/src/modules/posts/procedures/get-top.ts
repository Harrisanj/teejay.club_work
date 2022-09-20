import { Prisma } from "@teejay/prisma-client";
import { subDays, subHours, subMonths, subWeeks, subYears } from "date-fns";

import { getTopPostsInput } from "../inputs";
import { select } from "../selector";

import { t } from "@/trpc";
import { paginatePosts } from "@/utilities";

export const getTop = t.procedure
  .input(getTopPostsInput)
  .query(
    ({
      input: { interval, authorId, subsiteId, ...pagination },
      ctx: { user },
    }) => {
      const where: Prisma.PostWhereInput = {
        authorId,
        subsiteId,
        isPublished: true,
        score: {
          gte: 0
        },
        createdAt: {
          gte: {
            today: subHours(new Date(), 12),
            day: subDays(new Date(), 1),
            week: subWeeks(new Date(), 1),
            month: subMonths(new Date(), 1),
            year: subYears(new Date(), 1),
          }[interval],
        },
      };
      return paginatePosts({
        select: select(user?.id ?? -1),
        where: { OR: [{ isPinned: true, isPublished: true }, where] },
        orderBy: [
          { isPinned: "desc" },
          { score: "desc" },
          { createdAt: "desc" },
        ],
        ...pagination,
      });
    }
  );
