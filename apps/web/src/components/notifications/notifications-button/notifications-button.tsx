import { Popover, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Fragment, memo } from "react";

import { classNames, trpc } from "../../../utilities";
import { NotificationList } from "../notification-list";

export const NotificationsButton = memo(() => {
  const { data } = trpc.notifications.getUnreadCount.useQuery();
  const count = data ?? 0;

  return (
    <Popover className="relative ">
      <Popover.Button className="relative flex items-center">
        {count > 0 && (
          <div
            className={classNames(
              "absolute -top-1 -right-1 w-4 h-4",
              "flex items-center justify-center",
              "text-[10px] text-white bg-red-500",
              "shadow rounded-full overflow-hidden z-10"
            )}
          >
            {count > 9 ? (
              <span className="inline-flex items-center">
                9<span className="text-[8px]">+</span>
              </span>
            ) : (
              count
            )}
          </div>
        )}
        <BellIcon className="w-6 h-6 hover:stroke-amber-500 transition-colors duration-300" />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel
          className={classNames(
            "fixed top-14 left-0 right-0",
            "md:absolute md:top-auto md:left-auto md:-right-2 md:mt-2 origin-top-right",
            "h-80 z-10",
            "bg-white shadow-lg ring-1 ring-amber-500 ring-opacity-50 md:rounded-md",
            "overflow-auto focus:outline-none"
          )}
        >
          <NotificationList />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
});

NotificationsButton.displayName = "NotificationsButton";
