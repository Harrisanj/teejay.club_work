import { AppRouter } from "@teejay/api";

export type TComment = Omit<
  AppRouter["comments"]["getByPost"]["_def"]["_output_out"]["data"][0],
  "children"
> & {
  children?: AppRouter["comments"]["getByPost"]["_def"]["_output_out"]["data"][0]["children"];
};
