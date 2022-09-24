import { z } from "zod";

export const id = z.number().int().min(1);

export const sign = z
  .number()
  .int()
  .min(-1)
  .max(1)
  .refine((value) => value !== 0);

export const postTitle = z
  .string()
  .max(128, "Длина заголовка не должна быть больше 128 символов")
  .nullable();

export const postContent = z.object({
  // TODO: add validation for every block
  blocks: z.array(z.any()),
});
