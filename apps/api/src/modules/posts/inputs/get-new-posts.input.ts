import { z } from "zod";

import { paginationInput } from "@/modules/common";
import { id } from "@/utilities/zod-types";

export const getNewPostsInput = paginationInput.merge(
  z
    .object({
      authorId: id.optional(),
      subsiteId: id.optional(),
    })
    .strict()
);
