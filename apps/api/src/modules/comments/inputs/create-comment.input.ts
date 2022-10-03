import { z } from "zod";

import { id } from "@/utilities/zod-types";

export const createCommentInput = z.object({
  postId: id,
  parentId: id.optional(),
  text: z
    .string()
    .min(1, "Длина комментария не должна быть меньше 1 символа")
    .max(2048, "Длина комментария не должна быть больше 2048 символов"),
});
