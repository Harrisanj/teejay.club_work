import { z } from "zod";

import { paginationInput } from "@/modules/common";
import { id } from "@/utilities/zod-types";

export const getCommentsByAuthorInput = paginationInput.merge(
  z
    .object({
      authorId: id,
    })
    .strict()
);
