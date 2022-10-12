import { randomUUID } from "crypto";

import { FastifyInstance } from "fastify";
import fileUpload from "fastify-file-upload";
import sharp from "sharp";
import { z } from "zod";

import { createContext } from "./context";
import { prisma } from "./prisma";
import { s3 } from "./s3";

export function avatars(
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
    id: z.union([z.literal("default"), z.string().uuid()]),
  });

  server.get("/avatars/:id", async (request, reply) => {
    const params = paramsSchema.parse(request.params);

    try {
      const output = await s3
        .getObject({
          Bucket: "avatars",
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

  const rawSchema = z.object({
    files: z.object({
      file: z.object({
        name: z.string(),
        data: z.instanceof(Buffer),
      }),
    }),
  });

  server.post("/avatars", async (request, reply) => {
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

    const raw = rawSchema.parse(request.raw);
    const { file } = raw.files;

    try {
      const avatar = await sharp(file.data)
        .resize({
          width: 256,
          height: 256,
        })
        .rotate()
        .webp({ quality: 100, lossless: false })
        .toBuffer();

      const avatarId = randomUUID();

      const promises = [];

      promises.push(
        s3
          .putObject({
            Bucket: "avatars",
            Key: `${avatarId}.webp`,
            Body: avatar,
          })
          .promise()
      );

      if (user.avatarId) {
        promises.push(
          s3
            .deleteObject({
              Bucket: "avatars",
              Key: `${user.avatarId}.webp`,
            })
            .promise()
        );
      }

      promises.push(
        prisma.user.update({
          where: { id: user.id },
          data: { avatarId },
        })
      );

      await Promise.all(promises);
    } catch (error) {
      console.error(error);
      return reply.status(400).send();
    }

    reply.status(200).send();
  });

  done();
}
