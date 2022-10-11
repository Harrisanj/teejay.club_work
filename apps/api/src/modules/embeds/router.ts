import * as procedures from "./prodedures";

import { t } from "@/trpc";

export const router = t.router(procedures);
