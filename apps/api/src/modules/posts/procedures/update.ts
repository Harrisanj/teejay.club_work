import { TRPCError } from "@trpc/server";

import { updatePostInput } from "../inputs";
import { select } from "../selector";

import { blockGuard } from "@/guards";
import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const update = t.procedure
  .use(blockGuard)
  .input(updatePostInput)
  .mutation(
    async ({ input: { id, title, content, subsiteId }, ctx: { user } }) => {
      const post = await prisma.post.findFirstOrThrow({
        where: { id },
      });
      if (post.authorId !== user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return prisma.post.update({
        where: { id },
        data: {
          title,
          contentV2: content,
          authorId: user.id,
          subsiteId,
        },
        select: select(user.id),
      });
    }
  );
