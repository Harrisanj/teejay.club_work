import { z } from "zod";

import { id } from "@/utilities/zod-types";

export const readInput = z.object({
  ids: z.array(id),
});
