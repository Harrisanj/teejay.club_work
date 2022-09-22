import { AppRouter } from "@teejay/api";

type Comment =
  AppRouter["comments"]["getByPost"]["_def"]["_output_out"]["data"][0];

export type TComment = Comment & { children: TComment[] };
