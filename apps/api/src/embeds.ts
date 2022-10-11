import { FastifyInstance } from "fastify";
import { z } from "zod";

import { s3 } from "./s3";

export function embeds(
  server: FastifyInstance,
  options: unknown,
  done: () => void
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  server.get("/embeds/:id", async (request, reply) => {
    const params = paramsSchema.parse(request.params);

    try {
      const output = await s3
        .getObject({
          Bucket: "embeds",
          Key: `${params.id}.webp`,
        })
        .promise();

      return reply.header("Content-Type", "image/webp").send(output.Body);
    } catch (error) {
      console.error(error);
      return reply.status(404).send();
    }
  });

  done();
}
