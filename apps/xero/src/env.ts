import * as dotenv from "dotenv";
import { z } from "zod";

const schema = z.object({
  PORT: z
    .string()
    .regex(/\d+/)
    .transform((port) => +port),

  S3_REGION: z.string(),
  S3_ENPOINT: z.string().startsWith("http://"),
  S3_ACCESS_KEY_ID: z.string().min(16),
  S3_SECRET_ACCESS_KEY: z.string().min(16),
});

export const env = (() => {
  const result = dotenv.config();

  if (result.error) {
    throw result.error;
  }

  return schema.parse(result.parsed);
})();
