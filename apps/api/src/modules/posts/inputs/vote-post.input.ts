import { z } from "zod";

import { id, sign } from "@/utilities/zod-types";

export const votePostInput = z.object({
  postId: id,
  sign,
});
