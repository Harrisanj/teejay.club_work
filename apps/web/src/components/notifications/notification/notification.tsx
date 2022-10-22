import { AppRouter } from "@teejay/api";
import Link from "next/link";
import { memo, ReactNode, useCallback, useEffect, useRef } from "react";

import { classNames, trpc } from "../../../utilities";

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
  const { commentNotification } = notification;
  if (commentNotification) {
    const { post, commentId, commenter } = commentNotification;

    const commenterLink = (
      <span>
        <span className="font-medium">{commenter.name}</span>
      </span>
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
