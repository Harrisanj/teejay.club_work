import { observer } from "mobx-react-lite";

import { classNames, trpc } from "../../utilities";
import { Link } from "../link";

import { SignIn } from "./sign-in";
import { User } from "./user";

export const RightSide = observer(() => {
  const userQuery = trpc.users.getMe.useQuery();
  const user = userQuery.data;
  return (
    <div className="ml-auto flex flex-row gap-x-4 items-center z-20">
      {user && (
        <Link
          href="/posts/new"
          className={classNames(
            "px-3 py-1 flex flex-row gap-x-2",
            "border border-gray-200 bg-gray-100 text-gray-900",
            "hover:border-gray-300 hover:text-black hover:shadow-sm",
            "rounded-full transition-all"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 -mt-[1px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          <div className="text-sm">Написать</div>
        </Link>
      )}
      {user ? <User user={user} /> : <SignIn />}
    </div>
  );
});

RightSide.displayName = "RightSide";
