import { memo } from "react";

import { trpc } from "../../../utilities";
import { Spinner } from "../../spinner";
import { Notification } from "../notification";

export const NotificationList = memo(() => {
  const { data, isLoading } = trpc.notifications.get.useQuery({ take: 10 });
  return (
    <div className="relative w-screen max-w-xs h-full">
      <Spinner isSpinning={isLoading} />
      {data?.data.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
});

NotificationList.displayName = "NotificationList";
