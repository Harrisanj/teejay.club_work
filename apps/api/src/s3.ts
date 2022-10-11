import { S3 } from "aws-sdk";

import { config } from "./config";

// TODO: replace with @aws-sdk/client-s3
export const s3 = new S3({
  endpoint: config.S3_ENPOINT,
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});
