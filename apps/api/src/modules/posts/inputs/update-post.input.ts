import { z } from "zod";

import { id } from "@/utilities/zod-types";

export const updatePostInput = z.object({
  id,

  title: z.string(),
  content: z.object({
    // TODO: add validation for every block
    blocks: z.array(z.any()),
  }),
  subsiteId: id.optional(),
});
