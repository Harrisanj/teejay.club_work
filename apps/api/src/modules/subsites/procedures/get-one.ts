import { z } from "zod";

import { prisma } from "@/prisma";
import { t } from "@/trpc";
import { id } from "@/utilities/zod-types";

export const getOne = t.procedure
  .input(
    z.union([
      z.object({
        id,
      }),
      z.object({
        slug: z.string().min(3),
      }),
    ])
  )
  .query(async ({ input }) => {
    return prisma.subsite.findUniqueOrThrow({ where: input });
  });
