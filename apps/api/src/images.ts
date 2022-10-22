import { randomUUID } from "crypto";

import multipart from "@fastify/multipart";
import { FastifyInstance } from "fastify";
import sharp from "sharp";
import { z } from "zod";

import { createContext } from "./context";
import { prisma } from "./prisma";
import { s3 } from "./s3";

export function images(
  server: FastifyInstance,
  options: unknown,
  done: () => void
) {
  server.register(multipart, {
    limits: {
      fields: 1,
      files: 1,
      // 64 MiB
      fileSize: 1024 * 1024 * 64,
    },
  });

  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  server.get("/images/:id", async (request, reply) => {
    const params = paramsSchema.parse(request.params);

    try {
      const output = await s3
        .getObject({
          Bucket: "images",
          Key: `${params.id}.webp`,
        })
        .promise();

      return reply
        .header("Content-Type", "image/webp")
        .header("Cache-Control", "max-age=31536000")
        .send(output.Body);
    } catch (error) {
      console.error(error);
      return reply.status(404).send();
    }
  });

  server.post("/images", async (request, reply) => {
    const iteratorResult = await request.parts().next();

    if (iteratorResult.done) {
      return reply.status(400).send();
    }

    const part = iteratorResult.value;

    if (
      (!("value" in part) || part.fieldname !== "url") &&
      (!("file" in part) || part.fieldname !== "file")
    ) {
      return reply.status(400).send();
    }

    const context = await createContext({ req: request, res: reply });

    if (!context.user) {
      return reply.status(401).send();
    }

    const user = await prisma.user.findFirst({
      where: { id: context.user.id, blockedAt: null },
    });

    if (!user) {
      return reply.status(401).send();
    }

    let file: Buffer;
    if ("file" in part) {
      file = await part.toBuffer();
    } else {
      const response = await fetch(part.value as string);
      const arrayBuffer = await response.arrayBuffer();
      file = Buffer.from(arrayBuffer);
    }

    try {
      const image = await sharp(file, { animated: true })
        .resize({
          width: 2048,
          height: 1080,
          fit: "inside",
          withoutEnlargement: true,
        })
        .rotate()
        .webp({ quality: 100, lossless: false })
        .toBuffer();

      const imageId = randomUUID();

      await s3
        .putObject({
          Bucket: "images",
          Key: `${imageId}.webp`,
          Body: image,
        })
        .promise();

      return reply.status(200).send({ id: imageId });
    } catch (error) {
      console.error(error);
      return reply.status(400).send();
    }
  });

  done();
}
