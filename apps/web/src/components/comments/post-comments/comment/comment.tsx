import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRef } from "react";

import { classNames, getAvatarUrl } from "../../../../utilities";
import { Link } from "../../../link";
import { CommentVote } from "../../comment-vote";
import { CommentList } from "../comment-list";
import { NewCommentForm } from "../new-comment-form";
import { PostCommentsState } from "../post-comments.state";
import { TComment } from "../type";

const RelativeDate = dynamic(
  () => import("../../../relative-date").then((index) => index.RelativeDate),
  { ssr: false }
);

type Props = {
  state: PostCommentsState;
  comment: TComment;
  level: number;
};

export const Comment = observer<Props>(({ state, comment, level = 1 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleCreate = async () => {
    state.replyTo = null;
    await state.fetch();
  };

  return (
    <div
      ref={ref}
      className="relative flex flex-col"
      style={{ marginLeft: level > 1 && level <= 7 ? "1rem" : undefined }}
    >
      {level > 1 && (
        <div className="absolute -left-4 w-3 top-6 h-[1px] bg-gray-100 group-hover:bg-gray-200" />
      )}
      <div className="relative -top-14 invisible" />
      <div
        data-comment-id={comment.id}
        className={classNames({
          "group flex flex-col gap-y-1 -mx-4 px-4 py-2 transition-colors duration-300":
            true,
          "bg-amber-50": router.query.comment === comment.id.toString(),
        })}
      >
        <div className="flex flex-row items-center">
          <Link href={`/users/${comment.author.id}`}>
            <img
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
              alt={comment.author.name}
              src={getAvatarUrl(comment.author.avatarId)}
            />
          </Link>
          <div className="ml-2 flex flex-col">
            <div className="flex flex-row items-center">
              <Link href={`/users/${comment.author.id}`}>
                <div className="text-sm leading-5 font-medium">
                  {comment.author.name}
                </div>
              </Link>
              {comment.author.isVerified && (
                <svg
                  className="ml-1 w-4 h-4 fill-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {comment.parentId && (
                <Link
                  scroll={false}
                  href={`/posts/${comment.postId}?comment=${comment.parentId}`}
                  className={classNames(
                    "ml-1 opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-300 cursor-pointer"
                  )}
                >
                  <ArrowUpIcon className="w-3 h-3 stroke-[2px]" />
                </Link>
              )}
            </div>
            <Link
              scroll={false}
              href={`/posts/${comment.postId}?comment=${comment.id}`}
              className="text-xs text-gray-500"
            >
              <RelativeDate date={new Date(comment.createdAt)} />
            </Link>
          </div>
          <CommentVote comment={comment} />
        </div>
        <div className="whitespace-pre-line break-words">{comment.content}</div>
        <div className="flex flex-row">
          <button
            className="text-sm text-gray-500 cursor-pointer"
            onClick={() => (state.replyTo = comment.id)}
          >
            Ответить
          </button>
        </div>
      </div>
      {state.replyTo === comment.id && (
        <NewCommentForm
          postId={comment.postId}
          parentId={comment.id}
          onCreate={handleCreate}
          level={level}
        />
      )}
      {!!comment.children.length && (
        <CommentList
          state={state}
          comments={comment.children}
          level={level + 1}
        />
      )}
    </div>
  );
});

Comment.displayName = "Comment";
