import { z } from "zod";

import { paginationInput } from "@/modules/common";
import { id } from "@/utilities/zod-types";

export const getCommentsByPostInput = paginationInput.merge(
  z
    .object({
      postId: id,
      parentId: id.nullable().default(null),
    })
    .strict()
);
