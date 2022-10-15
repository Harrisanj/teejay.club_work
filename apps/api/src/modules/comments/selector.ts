import { Prisma } from "@teejay/prisma-client";

export const select = (userId: number) =>
  Prisma.validator<Prisma.CommentSelect>()({
    id: true,
    parentId: true,
    text: true,
    imageId: true,
    score: true,
    postId: true,
    editedAt: true,
    updatedAt: true,
    createdAt: true,
    post: {
      select: {
        id: true,
        title: true,
      },
    },
    author: {
      select: {
        id: true,
        name: true,
        avatarId: true,
        isVerified: true,
      },
    },
    votes: {
      where: { userId },
      select: {
        id: true,
        sign: true,
      },
    },
    _count: { select: { children: true } },
  });
