import { AppRouter } from "@teejay/api";
import { memo, ReactNode, useCallback, useEffect, useRef } from "react";

import { classNames } from "../../../utilities";
import { Link } from "../../link";

type TNotification =
  AppRouter["notifications"]["get"]["_def"]["_output_out"]["data"][0];

type Props = {
  notification: TNotification;
  onRead?: (notificationId: number) => void;
};

export const Notification = memo<Props>(({ notification, onRead }) => {
  const ref = useRef<HTMLDivElement>(null);
  const text = useNotificationText(notification);

  const handleIntersect: IntersectionObserverCallback = useCallback(
    (entries) => {
      const entry = entries[0];

      if (entry.intersectionRatio !== 1) {
        return;
      }

      const observer = observerRef.current;
      observer.disconnect();
      onRead?.(notification.id);
    },
    [notification.id, onRead]
  );

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (notification.readAt) {
      return;
    }

    const observer = observerRef.current;
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, notification.id, notification.readAt]);

  const observerRef = useRef<IntersectionObserver>(
    new IntersectionObserver(handleIntersect, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })
  );

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
  const { replyToPostNotification } = notification;

  if (replyToPostNotification) {
    const { replyTo: post, reply: comment } = replyToPostNotification;

    const commenterLink = (
      <Link href={`/users/${comment.author.id}`} className="font-medium">
        {comment.author.name}
      </Link>
    );

    const postLink = post.title ? (
      <>
        посту{" "}
        <Link href={`/posts/${post.id}`} className="font-medium">
          {post.title}
        </Link>
      </>
    ) : (
      <Link href={`/posts/${post.id}`} className="font-medium">
        посту
      </Link>
    );

    return (
      <div className="py-2 px-4">
        {commenterLink} оставил{" "}
        <Link
          href={`/posts/${post.id}?comment=${comment.id}`}
          className="font-medium"
        >
          комментарий
        </Link>{" "}
        к вашему {postLink}.
      </div>
    );
  }

  return null;
}
