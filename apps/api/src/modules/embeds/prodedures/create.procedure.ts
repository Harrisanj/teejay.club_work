import { createInput } from "../inputs";
import { createOutput } from "../outputs";

import { blockGuard } from "@/guards";
import { t } from "@/trpc";

export const create = t.procedure
  .use(blockGuard)
  .input(createInput)
  .output(createOutput)
  .mutation(async ({ input }) => {
    const response = await fetch("http://localhost:8044", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return await response.json();
  });
