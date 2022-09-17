import { z } from "zod";

import { id, sign } from "@/utilities/zod-types";

export const voteCommentInput = z.object({
  commentId: id,
  sign,
});
