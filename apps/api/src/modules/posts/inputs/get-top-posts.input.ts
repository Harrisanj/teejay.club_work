import { z } from "zod";

import { paginationInput } from "@/modules/common";
import { id } from "@/utilities/zod-types";

export const getTopPostsInput = paginationInput.merge(
  z
    .object({
      interval: z.union([
        z.literal("today"),
        z.literal("day"),
        z.literal("week"),
        z.literal("month"),
        z.literal("year"),
      ]),
      authorId: id.optional(),
      subsiteId: id.optional(),
    })
    .strict()
);
