import fastify from "fastify";

import { env } from "./env";
import { Xero } from "./xero";

const server = fastify({ logger: true });
let xero: Xero;

server.post("/", async (request) => {
  try {
    return await xero.handle(request.body);
  } catch (error) {
    console.error(error);
    return { error: "Unknown error" };
  }
});

async function main() {
  try {
    xero = await Xero.start();
    await server.listen({ port: env.PORT });
  } catch (error) {
    server.log.error(error);
    await xero.stop();
    process.exit(1);
  }
}

main();
