import * as procedures from "./procedures";

import { t } from "@/trpc";

export const router = t.router(procedures);
