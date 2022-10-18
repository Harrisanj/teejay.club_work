import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { observer } from "mobx-react-lite";

import { classNames, trpc } from "../../utilities";
import { Link } from "../link";
import { NotificationsButton } from "../notifications";

import { SignIn } from "./sign-in";
import { User } from "./user";

export const RightSide = observer(() => {
  const { data: user } = trpc.users.getMe.useQuery();
  return (
    <div className="ml-auto flex flex-row gap-x-4 items-center z-20">
      {user && (
        <Link href="/posts/new">
          <PencilSquareIcon className="w-6 h-6 hover:stroke-amber-500 transition-colors duration-300" />
        </Link>
      )}
      {user && <NotificationsButton />}
      {user ? <User /> : <SignIn />}
    </div>
  );
});

RightSide.displayName = "RightSide";
