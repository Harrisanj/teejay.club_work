import { z } from "zod";

import { id, postContent, postTitle } from "@/utilities/zod-types";

export const createPostInput = z
  .object({
    title: postTitle,
    content: postContent,
    subsiteId: id.optional(),
  })
  .strict();
