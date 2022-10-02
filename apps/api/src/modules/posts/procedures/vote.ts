import { TRPCError } from "@trpc/server";

import { votePostInput } from "../inputs";

import { blockGuard } from "@/guards";
import { posts, postVotes } from "@/modules";
import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const vote = t.procedure
  .use(blockGuard)
  .input(votePostInput)
  .mutation(async ({ input: { postId, sign }, ctx: { user } }) => {
    const userId = user.id;

    const post = await prisma.post.findFirstOrThrow({
      where: { id: postId },
      select: {
        id: true,
        authorId: true,
        score: true,
        votes: {
          where: { postId, userId },
          select: postVotes.select(),
        },
      },
    });

    if (post.authorId === userId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    // CREATE
    // 42 -> +1 -> 43
    if (!post.votes.length) {
      return prisma.post.update({
        where: { id: postId },
        data: {
          score: { increment: sign },
          votes: { create: { sign, userId } },
        },
        select: posts.select(userId),
      });
    }

    const vote = post.votes[0];

    // DELETE
    // 42 -> +1 -> 43 -> +1 ->42
    if (vote.sign === sign) {
      return prisma.post.update({
        where: { id: postId },
        data: {
          score: { decrement: sign },
          votes: { delete: { postId_userId: { postId, userId } } },
        },
        select: posts.select(userId),
      });
    }

    // UPDATE
    // 42 -> +1 -> 43 -> -1 -> 41
    // 42 -> -1 -> 41 -> +1 -> 43
    return prisma.post.update({
      where: { id: postId },
      data: {
        score: { decrement: vote.sign - sign },
        votes: {
          update: {
            where: { postId_userId: { postId, userId } },
            data: { sign },
          },
        },
      },
      select: posts.select(userId),
    });
  });
