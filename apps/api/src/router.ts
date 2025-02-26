import {
  auth,
  comments,
  embeds,
  invites,
  notifications,
  posts,
  subsites,
  users,
} from "@/modules";
import { t } from "@/trpc";

export const appRouter = t.router({
  auth: auth.router,
  comments: comments.router,
  embeds: embeds.router,
  invites: invites.router,
  posts: posts.router,
  subsites: subsites.router,
  users: users.router,
  notifications: notifications.router,
});

export type AppRouter = typeof appRouter;
