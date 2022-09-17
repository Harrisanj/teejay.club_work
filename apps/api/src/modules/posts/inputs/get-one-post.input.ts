import { z } from "zod";

import { id } from "@/utilities/zod-types";

export const getOnePostInput = z.object({
  id,
});
