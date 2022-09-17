import { z } from "zod";

export const id = z.number().int().min(1);

export const sign = z
  .number()
  .int()
  .min(-1)
  .max(1)
  .refine((value) => value !== 0);
