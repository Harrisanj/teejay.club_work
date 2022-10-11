import { z } from "zod";

export const createOutput = z.array(
  z.object({
    uuid: z.string().uuid(),
    media: z.string(),
    size: z.object({
      width: z.number().int(),
      height: z.number().int(),
    }),
  })
);
