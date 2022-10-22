import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";

import { avatars } from "./avatars";
import { config } from "./config";
import { embeds } from "./embeds";
import { images } from "./images";

import { createContext } from "@/context";
import { appRouter } from "@/router";

const server = fastify({
  maxParamLength: 5000,
  logger: false,
});

server.register(cors);

// TODO: move to separate package
server.register(avatars);
server.register(images);
server.register(embeds);

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

(async () => {
  try {
    await server.listen({ port: +config.PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
