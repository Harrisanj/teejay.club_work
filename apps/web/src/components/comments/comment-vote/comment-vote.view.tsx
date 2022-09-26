import { TComment } from "@teejay/api";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

import { classNames, trpc, useClientSideTRPC } from "../../../utilities";

import { CommentVoteState } from "./comment-vote.state";

type Props = { comment: TComment };

export const CommentVote = observer<Props>(({ comment }) => {
  const trpcClient = useClientSideTRPC();
  const state = useMemo(
    () => new CommentVoteState(trpcClient, comment),
    [comment, trpcClient]
  );
  const userQuery = trpc.users.getMe.useQuery();
  const user = userQuery.data ?? undefined;
  console.log(user);
  return (
    <div className="ml-auto flex flex-row items-center gap-x-1 text-sm">
      <button
        className={classNames({
          "p-1 rounded-full transition-colors duration-500": true,
          "cursor-default": !user,
          "hover:bg-gray-100 cursor-pointer": !!user,
        })}
        onClick={user && state.handleDownvoteClick}
      >
        <svg
          className={classNames({
            "w-4 h-4 transition-colors duration-500": true,
            "stroke-black": state.vote?.sign !== -1,
            "stroke-red-600": state.vote?.sign === -1,
          })}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      <div
        className={classNames({
          "text-sm transition-colors duration-500": true,
          "text-green-600": state.comment.score > 0,
          "text-red-600": state.comment.score < 0,
        })}
      >
        {state.comment.score >= 0 && <span className="invisible">-</span>}
        {state.comment.score}
        <span className="invisible">-</span>
      </div>
      <button
        className={classNames({
          "p-0.5 rounded-full transition-colors duration-500": true,
          "cursor-default": !user,
          "hover:bg-gray-100 cursor-pointer": !!user,
        })}
        onClick={user && state.handleUpvoteClick}
      >
        <svg
          className={classNames({
            "w-4 h-4 transition-colors duration-500": true,
            "stroke-black": state.vote?.sign !== 1,
            "stroke-green-600": state.vote?.sign === 1,
          })}
          strokeWidth={2}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
});
