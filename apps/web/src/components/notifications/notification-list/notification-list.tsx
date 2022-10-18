import { memo, useRef } from "react";

import { useInfiniteScroll } from "../../../hooks";
import { trpc } from "../../../utilities";
import { Spinner } from "../../spinner";
import { Notification } from "../notification";

export const NotificationList = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const query = trpc.notifications.get.useInfiniteQuery(
    { take: 10 },
    { getNextPageParam: (page) => page.meta.nextCursor }
  );

  useInfiniteScroll(
    query.isFetching,
    query.hasNextPage,
    query.fetchNextPage,
    ref
  );

  return (
    <div
      ref={ref}
      className="relative w-screen max-w-xs h-full overflow-scroll"
    >
      <Spinner isSpinning={query.isLoading} />
      {query.data?.pages.map((page) =>
        page.data.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))
      )}
    </div>
  );
});

NotificationList.displayName = "NotificationList";
