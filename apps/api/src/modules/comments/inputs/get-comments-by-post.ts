import { z } from "zod";

import { id } from "@/utilities/zod-types";

export const getCommentsByPostInput = z
  .object({
    postId: id,
    parentId: id.nullable().default(null),
    commentId: id.nullable().default(null),
  })
  .strict();
