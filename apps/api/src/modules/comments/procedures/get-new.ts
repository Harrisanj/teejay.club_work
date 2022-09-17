import { select } from "../selector";

import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const getNew = t.procedure.query(async ({ ctx: { user } }) => {
  const data = await prisma.comment.findMany({
    select: select(user?.id ?? -1),
    where: { post: { isPublished: true } },
    orderBy: [{ createdAt: "desc" }],
    take: 10,
  });
  return { data };
});
