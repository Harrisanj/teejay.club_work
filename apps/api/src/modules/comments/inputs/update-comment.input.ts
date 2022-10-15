import { z } from "zod";

import { id } from "@/utilities/zod-types";

const text = z
  .string()
  .trim()
  .min(1, "Длина комментария не должна быть меньше 1 символа")
  .max(2048, "Длина комментария не должна быть больше 2048 символов");

const imageId = z.string().uuid();

export const updateCommentInput = z.union([
  z.object({ id, text: text.optional(), imageId }),
  z.object({ id, text, imageId: imageId.optional() }),
]);
