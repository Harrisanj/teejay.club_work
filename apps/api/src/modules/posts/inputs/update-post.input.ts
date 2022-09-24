import { z } from "zod";

import { id, postContent, postTitle } from "@/utilities/zod-types";

export const updatePostInput = z.object({
  id,

  title: postTitle,
  content: postContent,
  subsiteId: id.optional(),
});
