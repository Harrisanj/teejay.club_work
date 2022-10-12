import { randomUUID } from "crypto";

import { FastifyInstance } from "fastify";
import fileUpload from "fastify-file-upload";
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
  server.register(fileUpload, {
    limits: {
      fields: 3,
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

  const rawSchema = z.union([
    z.object({
      files: z.object({
        file: z.object({
          name: z.string(),
          data: z.instanceof(Buffer),
        }),
      }),
    }),
    z.object({
      body: z.object({
        url: z.string().url(),
      }),
    }),
  ]);

  server.post("/images", async (request, reply) => {
    const raw = rawSchema.safeParse(request.raw);

    if (!raw.success) {
      return reply.status(400).send();
    }

    const context = await createContext({ req: request, res: reply });

    if (!context.user) {
      return reply.status(401).send();
    }

    const user = await prisma.user.findUnique({
      where: { id: context.user.id },
    });

    if (!user) {
      return reply.status(401).send();
    }

    let file;
    if ("body" in raw.data) {
      const response = await fetch(raw.data.body.url);
      const arrayBuffer = await response.arrayBuffer();
      file = Buffer.from(arrayBuffer);
    } else {
      file = raw.data.files.file.data;
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
        .webp({ quality: 75, lossless: false })
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
