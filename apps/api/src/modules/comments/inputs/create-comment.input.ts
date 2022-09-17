import { z } from "zod";

import { id } from "@/utilities/zod-types";

export const createCommentInput = z.object({
  postId: id,
  parentId: id.optional(),
  content: z.string().min(3),
});
