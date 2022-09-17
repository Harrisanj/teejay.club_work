import { z } from "zod";

import { select } from "../selector";

import { prisma } from "@/prisma";
import { t } from "@/trpc";
import { id } from "@/utilities/zod-types";

export const getOne = t.procedure
  .input(z.object({ id }).strict())
  .query(async ({ input: { id } }) => {
    return prisma.user.findFirstOrThrow({
      where: { id },
      select: select(),
    });
  });
