import { TRPCError } from "@trpc/server";

import { voteCommentInput } from "../inputs";

import { blockGuard } from "@/guards";
import { comments, commentVotes } from "@/modules";
import { prisma } from "@/prisma";
import { t } from "@/trpc";

export const vote = t.procedure
  .use(blockGuard)
  .input(voteCommentInput)
  .mutation(async ({ input: { commentId, sign }, ctx: { user } }) => {
    const userId = user.id;

    const comment = await prisma.comment.findFirstOrThrow({
      where: { id: commentId },
      select: {
        id: true,
        score: true,
        authorId: true,
        votes: {
          where: { commentId, userId },
          select: commentVotes.select(),
        },
      },
    });

    if (comment.authorId === userId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    // CREATE
    // 42 -> +1 -> 43
    if (!comment.votes.length) {
      return prisma.comment.update({
        where: { id: commentId },
        data: {
          score: { increment: sign },
          votes: { create: { sign, userId } },
        },
        select: comments.select(userId),
      });
    }

    const vote = comment.votes[0];

    // DELETE
    // 42 -> +1 -> 43 -> +1 ->42
    if (vote.sign === sign) {
      return prisma.comment.update({
        where: { id: commentId },
        data: {
          score: { decrement: sign },
          votes: { delete: { commentId_userId: { commentId, userId } } },
        },
        select: comments.select(userId),
      });
    }

    // UPDATE
    // 42 -> +1 -> 43 -> -1 -> 41
    // 42 -> -1 -> 41 -> +1 -> 43
    return prisma.comment.update({
      where: { id: commentId },
      data: {
        score: { decrement: vote.sign - sign },
        votes: {
          update: {
            where: { commentId_userId: { commentId, userId } },
            data: { sign },
          },
        },
      },
      select: comments.select(userId),
    });
  });
