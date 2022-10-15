import { z } from "zod";

import { id } from "@/utilities/zod-types";

const base = z.object({
  postId: id,
  parentId: id.optional(),
});

const text = z
  .string()
  .trim()
  .min(1, "Длина комментария не должна быть меньше 1 символа")
  .max(2048, "Длина комментария не должна быть больше 2048 символов");

const imageId = z.string().uuid();

export const createCommentInput = z.union([
  base.merge(z.object({ text: text.optional(), imageId })),
  base.merge(z.object({ text, imageId: imageId.optional() })),
]);
