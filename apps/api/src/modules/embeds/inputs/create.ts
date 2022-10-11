import { z } from "zod";

export const createInput = z.union([
  z
    .object({
      type: z.literal("telegram"),
      payload: z.string().regex(/^.+\/\d+$/),
    })
    .strict(),
  z
    .object({
      type: z.literal("twitter"),
      payload: z.string().regex(/^\d+$/),
    })
    .strict(),
  z
    .object({
      type: z.literal("reddit"),
      payload: z.string().regex(/^\/r\/.+\/comments\/.+\/.+\/$/),
    })
    .strict(),
]);
