import { TComment } from "@teejay/api";
import { memo } from "react";

import { classNames } from "../../../utilities";

import { useCommentVoteState } from "./comment-vote.state";

export type Props = { comment: TComment };

export const CommentVote = memo<Props>((props) => {
  const state = useCommentVoteState(props);
  return (
    <div className="ml-auto flex flex-row items-center gap-x-0.5 text-sm">
      <button
        className={classNames({
          "p-1 rounded-full transition-colors duration-500": true,
          "hover:bg-gray-100 cursor-pointer": state.isClickable,
          "cursor-default": !state.isClickable,
          hidden: !state.isUserLoggedIn,
        })}
        onClick={state.handleDownvoteClick}
      >
        <svg
          className={classNames({
            "w-4 h-4 transition-colors duration-500": true,
            "stroke-black": state.comment.votes[0]?.sign !== -1,
            "stroke-red-600": state.comment.votes[0]?.sign === -1,
            "!stroke-gray-300": !state.isClickable,
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
          "p-1 rounded-full transition-colors duration-500": true,
          "hover:bg-gray-100 cursor-pointer": state.isClickable,
          "cursor-default": !state.isClickable,
          hidden: !state.isUserLoggedIn,
        })}
        onClick={state.handleUpvoteClick}
      >
        <svg
          className={classNames({
            "w-4 h-4 transition-colors duration-500": true,
            "stroke-black": state.comment.votes[0]?.sign !== 1,
            "stroke-green-600": state.comment.votes[0]?.sign === 1,
            "!stroke-gray-300": !state.isClickable,
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

CommentVote.displayName = "CommentVote";
