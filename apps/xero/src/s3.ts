import { S3Client } from "@aws-sdk/client-s3";

import { env } from "./env";

const s3 = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export { s3 };
