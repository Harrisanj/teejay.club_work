import { memo, useCallback, useEffect, useRef } from "react";

import { useInfiniteScroll } from "../../../hooks";
import { trpc } from "../../../utilities";
import { Spinner } from "../../spinner";
import { Notification } from "../notification";

export const NotificationList = memo(() => {
  const listRef = useRef<HTMLDivElement>(null);

  const query = trpc.notifications.get.useInfiniteQuery(
    { take: 10 },
    { getNextPageParam: (page) => page.meta.nextCursor }
  );

  const idsBatch = useRef<Set<number>>(new Set());
  const timeoutId = useRef<number>();

  const context = trpc.useContext();
  const readMutation = trpc.notifications.read.useMutation({
    onSuccess() {
      context.notifications.getUnreadCount.invalidate();
      context.notifications.get.invalidate();
    },
  });

  const read = useCallback(() => {
    const ids = [...idsBatch.current];
    idsBatch.current.clear();
    readMutation.mutate({ ids });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRead = useCallback(
    (id: number) => {
      console.log(id);
      idsBatch.current.add(id);
      clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(read, 100);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => () => clearTimeout(timeoutId.current), []);

  useInfiniteScroll(
    query.isFetching,
    query.hasNextPage,
    query.fetchNextPage,
    listRef
  );

  return (
    <div
      ref={listRef}
      className="relative w-screen max-w-xs h-full overflow-scroll"
    >
      <Spinner isSpinning={query.isLoading} />
      {query.data?.pages?.[0]?.data?.length === 0 && (
        <div className="py-2 px-4 h-full flex items-center justify-center text-sm text-gray-500">
          Уведомлений нет.
        </div>
      )}
      {query.data?.pages.map((page) =>
        page.data.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onRead={handleRead}
          />
        ))
      )}
    </div>
  );
});

NotificationList.displayName = "NotificationList";
