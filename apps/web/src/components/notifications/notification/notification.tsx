import { AppRouter } from "@teejay/api";
import { makeAutoObservable } from "mobx";
import Link from "next/link";
import {
  Fragment,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { classNames, trpc } from "../../../utilities";

type TNotification =
  AppRouter["notifications"]["get"]["_def"]["_output_out"]["data"][0];

type Props = {
  notification: TNotification;
};

export const Notification = memo<Props>(({ notification }) => {
  const ref = useRef<HTMLDivElement>(null);
  const text = useNotificationText(notification);
  const trpcContext = trpc.useContext();
  const readMutation = trpc.notifications.read.useMutation();

  const handleIntersect: IntersectionObserverCallback = useCallback(
    (entries) => {
      const entry = entries[0];

      if (entry.intersectionRatio !== 1) {
        return;
      }

      readMutation.mutate({ id: notification.id });

      trpcContext.notifications.get.invalidate();
      trpcContext.notifications.getUnreadCount.invalidate();
    },
    [
      notification.id,
      readMutation,
      trpcContext.notifications.get,
      trpcContext.notifications.getUnreadCount,
    ]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (notification.readAt) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, notification.id, notification.readAt]);

  return (
    <div
      ref={ref}
      className={classNames(
        "text-sm border-t border-gray-100 first:border-none",
        { "bg-amber-50": !notification.readAt }
      )}
    >
      {text}
    </div>
  );
});

Notification.displayName = "Notification";

function useNotificationText(notification: TNotification): ReactNode {
  const { commentNotification } = notification;
  if (commentNotification) {
    const { post, commentId, commenter } = commentNotification;

    const commenterLink = (
      <Link href={`/users/${commenter.id}`}>
        <a className="font-medium">{commenter.name}</a>
      </Link>
    );

    return (
      <Link href={`/posts/${post.id}?comment=${commentId}`}>
        <a className="block py-2 px-4">
          {commenterLink} оставил комментарий к вашему посту
          {post.title ? (
            <>
              {" "}
              <span className="font-medium">{post.title}</span>
            </>
          ) : null}
          .
        </a>
      </Link>
    );
  }
  return null;
}
