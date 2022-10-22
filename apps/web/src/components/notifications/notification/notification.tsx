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
  const { replyToPostNotification, replyToCommentNotification } = notification;

  if (replyToPostNotification) {
    const { replyTo, reply } = replyToPostNotification;

    const replyAuthorLink = (
      <Link href={`/users/${reply.author.id}`} className="font-medium">
        {reply.author.name}
      </Link>
    );

    const replyLink = (
      <Link
        href={`/posts/${reply.postId}?comment=${reply.id}`}
        className="font-medium"
      >
        комментарий
      </Link>
    );

    const replyToLink = replyTo.title ? (
      <>
        посту{" "}
        <Link href={`/posts/${replyTo.id}`} className="font-medium">
          {replyTo.title}
        </Link>
      </>
    ) : (
      <Link href={`/posts/${replyTo.id}`} className="font-medium">
        посту
      </Link>
    );

    return (
      <div className="py-2 px-4">
        {replyAuthorLink} оставил {replyLink} к вашему {replyToLink}.
      </div>
    );
  }

  if (replyToCommentNotification) {
    const { replyTo, reply } = replyToCommentNotification;

    const replyAuthorLink = (
      <Link href={`/users/${reply.author.id}`} className="font-medium">
        {reply.author.name}
      </Link>
    );

    const replyLink = (
      <Link
        href={`/posts/${reply.postId}?comment=${reply.id}`}
        className="font-medium"
      >
        ответ
      </Link>
    );

    const replyToLink = (
      <Link
        href={`/posts/${replyTo.postId}?comment=${replyTo.id}`}
        className="font-medium"
      >
        комментарию
      </Link>
    );

    return (
      <div className="py-2 px-4">
        {replyAuthorLink} оставил {replyLink} к вашему {replyToLink}.
      </div>
    );
  }

  return null;
}
