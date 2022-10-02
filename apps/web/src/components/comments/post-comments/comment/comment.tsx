import { Menu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon, PencilIcon } from "@heroicons/react/20/solid";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { addMinutes, isBefore, isSameSecond } from "date-fns";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";

import { classNames, getAvatarUrl, trpc } from "../../../../utilities";
import { Link } from "../../../link";
import { CommentVote } from "../../comment-vote";
import { CommentList } from "../comment-list";
import { EditCommentForm } from "../edit-comment-form";
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
  const [isEditing, setIsEditing] = useState(false);
  const { data: user } = trpc.users.getMe.useQuery();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 15 * 1000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const canEdit =
    !!user &&
    user.id === comment.author.id &&
    isBefore(now, addMinutes(comment.createdAt, 15));

  const trpcContext = trpc.useContext();

  const handleSubmit = async () => {
    state.replyTo = null;
    setIsEditing(false);
    await Promise.all([
      trpcContext.comments.getNew.refetch(),
      trpcContext.posts.getOne.refetch(),
      state.fetch(),
    ]);
  };

  const handleReplyClick = () => {
    state.replyTo = comment.id;
    setIsEditing(false);
  };

  const handleEditClick = () => {
    state.replyTo = null;
    setIsEditing(true);
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
            <div className="flex flex-row items-center gap-x-1">
              <Link
                scroll={false}
                href={`/posts/${comment.postId}?comment=${comment.id}`}
                className="text-xs text-gray-500"
              >
                <RelativeDate date={new Date(comment.createdAt)} />
              </Link>
              {!isSameSecond(comment.createdAt, comment.updatedAt) && (
                <time dateTime={comment.updatedAt.toISOString()}>
                  <PencilIcon className="w-2.5 h-2.5 fill-gray-500" />
                </time>
              )}
            </div>
          </div>
        </div>
        <div className="whitespace-pre-line break-words">{comment.content}</div>
        <div className="flex flex-row items-end gap-x-1">
          <button
            className="text-sm text-gray-500 cursor-pointer"
            onClick={handleReplyClick}
          >
            Ответить
          </button>
          {canEdit && (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center p-0.5">
                <EllipsisHorizontalIcon className="w-4 h-4" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  className={classNames(
                    "absolute -left-2 origin-top-left mt-1 max-h-56 z-10",
                    "bg-white shadow-lg ring-1 ring-amber-500 ring-opacity-50 rounded-md",
                    "overflow-auto focus:outline-none"
                  )}
                >
                  <Menu.Item
                    as="div"
                    className={classNames(
                      "flex flex-row gap-x-2 items-center px-4 py-2 text-sm whitespace-nowrap",
                      "text-gray-900 hover:bg-gray-100 cursor-pointer"
                    )}
                    onClick={handleEditClick}
                  >
                    Редактировать
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
          <div className="ml-auto">
            <CommentVote comment={comment} />
          </div>
        </div>
      </div>
      {isEditing && (
        <EditCommentForm
          id={comment.id}
          text={comment.content}
          postId={comment.postId}
          parentId={comment.id}
          level={level}
          onSubmit={handleSubmit}
        />
      )}
      {state.replyTo === comment.id && (
        <EditCommentForm
          postId={comment.postId}
          parentId={comment.id}
          level={level}
          onSubmit={handleSubmit}
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
