import { z } from "zod";

import { id } from "@/utilities/zod-types";

export const getCommentsByPostInput = z
  .object({
    postId: id,
    lastCreatedAt: z.date().optional(),
  })
  .strict();
