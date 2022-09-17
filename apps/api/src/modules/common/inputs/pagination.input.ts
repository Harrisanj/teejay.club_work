import { z } from "zod";

import { id } from "@/utilities/zod-types";

export const paginationInput = z
  .object({
    take: z.number().int().min(1).max(20).default(20),
    skip: z.number().int().min(0).default(0),
    cursor: z.object({ id }).optional(),
  })
  .strict();
