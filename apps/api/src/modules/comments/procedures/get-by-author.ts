import { getCommentsByAuthorInput } from "../inputs";
import { select } from "../selector";

import { t } from "@/trpc";
import { paginateComments } from "@/utilities";

export const getByAuthor = t.procedure
  .input(getCommentsByAuthorInput)
  .query(({ input: { authorId, ...pagination }, ctx: { user } }) => {
    return paginateComments({
      select: select(user?.id ?? -1),
      where: {
        authorId,
        post: { isPublished: true },
      },
      orderBy: { createdAt: "desc" },
      ...pagination,
    });
  });
