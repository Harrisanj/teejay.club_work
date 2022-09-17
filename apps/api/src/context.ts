import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify/index.js";
import { z } from "zod";

import { extractJwt, verifyJwt } from "@/utilities";
import { id } from "@/utilities/zod-types";

const idSchema = z.preprocess(
  (value) => (typeof value === "string" ? +value : value),
  id
);

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  let user: { id: number } | undefined = undefined;

  try {
    const jwt = await extractJwt(req.headers.authorization);
    if (jwt.trim().length) {
      const payload = await verifyJwt(jwt);
      const id = idSchema.parse(payload.sub);
      user = { id };
    }
  } catch (error) {
    console.error(error);
  }

  return { req, res, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
