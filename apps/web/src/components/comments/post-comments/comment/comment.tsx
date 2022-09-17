import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FC, useRef, useState } from "react";

import {
  classNames,
  getAvatarUrl,
  isElementInViewport,
  trpc,
} from "../../../../utilities";
import { Link } from "../../../link";
import { CommentVote } from "../../comment-vote";
import { CommentList } from "../comment-list";
import { NewCommentForm } from "../new-comment-form";
import { TComment } from "../type";

const RelativeDate = dynamic(
  () => import("../../../relative-date").then((index) => index.RelativeDate),
  { ssr: false }
);

type Props = {
  comment: TComment;
  level: number;
  replyTo?: number;
  onReplyToChange: (replyTo?: number) => void;
};

export const Comment: FC<Props> = ({
  comment,
  level = 1,
  replyTo,
  onReplyToChange,
}) => {
  const [isQueryEnabled, setIsQueryEnabled] = useState(!!comment.children);
  const childrenQuery = trpc.comments.getByPost.useQuery(
    {
      postId: comment.postId,
      parentId: comment.id,
    },
    {
      enabled: isQueryEnabled,
      initialData: comment ? { data: comment.children } : undefined,
      refetchInterval: 5000,
    }
  );
  const children = childrenQuery.data?.data;

  const router = useRouter();
  const url = new URL(router.asPath, "https://teejay.club");

  const ref = useRef<HTMLDivElement>(null);

  const handleCreate = async () => {
    onReplyToChange();
    setIsQueryEnabled(true);
    await childrenQuery.refetch();

    // wait render
    requestAnimationFrame(() => {
      if (!ref.current) {
        return;
      }

      if (isElementInViewport(ref.current)) {
        return;
      }

      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  };

  return (
    <div
      ref={ref}
      className="relative flex flex-col"
      style={{ marginLeft: level > 1 && level <= 7 ? "1rem" : undefined }}
    >
      {level > 1 && (
        <div className="absolute -left-4 w-3 top-6 h-[1px] bg-gray-300" />
      )}
      <div
        id={`comments/${comment.id}`}
        className="relative -top-14 invisible"
      />
      <div
        className={classNames({
          "flex flex-col gap-y-1 -mx-4 px-4 py-2 transition-colors duration-300":
            true,
          "bg-amber-100": url.hash === `#comments/${comment.id}`,
        })}
      >
        <div className="flex flex-row items-center">
          <img
            className="w-8 h-8 rounded-full"
            width={32}
            height={32}
            alt={comment.author.name}
            src={getAvatarUrl(comment.author.avatarId)}
          />
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
            </div>
            <div className="text-xs text-gray-500">
              <RelativeDate date={new Date(comment.createdAt)} />
            </div>
          </div>
          <CommentVote comment={comment} />
        </div>
        <div className="whitespace-pre-line break-words">{comment.content}</div>
        <div className="flex flex-row">
          <button
            className="text-sm text-gray-500 cursor-pointer"
            onClick={() => onReplyToChange(comment.id)}
          >
            Ответить
          </button>
        </div>
      </div>
      {replyTo === comment.id && (
        <NewCommentForm
          postId={comment.postId}
          parentId={comment.id}
          onCreate={handleCreate}
          level={level}
        />
      )}
      {children ? (
        <CommentList
          comments={children}
          level={level + 1}
          replyTo={replyTo}
          onReplyToChange={onReplyToChange}
        />
      ) : childrenQuery.isFetching ? (
        <div className="text-sm text-gray-500">Загрузка...</div>
      ) : (
        !!comment._count.children && (
          <div>
            <button
              className="text-sm text-blue-500"
              onClick={() => setIsQueryEnabled(true)}
            >
              Ещё комментарии
            </button>
          </div>
        )
      )}
    </div>
  );
};
