import { FC } from "react";

import { trpc, getAvatarUrl, getImageUrl } from "../../../utilities";
import { Link } from "../../link";
import { RelativeDate } from "../../relative-date";

export const NewComments: FC = () => {
  const commentsQuery = trpc.comments.getNew.useQuery(void 0, {
    refetchInterval: 5000,
  });

  const comments = commentsQuery.data?.data ?? [];

  if (!comments) {
    return null;
  }

  return (
    <div className="hidden xl:flex xl:pr-8 flex-col w-[20rem] min-w-[20rem] p-2">
      <div className="font-medium text-xl">Свежие комментарии</div>
      <div className="mt-4 flex flex-col gap-y-4">
        {comments.map((comment) => (
          <Link
            key={comment.id}
            href={`/posts/${comment.postId}?comment=${comment.id}`}
            className="flex flex-col gap-y-1 text-sm"
          >
            <div className="flex flex-row items-center">
              <img
                className="w-5 h-5 rounded"
                width={20}
                height={20}
                alt={comment.author.name}
                src={getAvatarUrl(comment.author.avatarId)}
              />
              <div className="ml-2 flex flex-row gap-x-1 items-center">
                <div className="leading-5 font-medium">
                  {comment.author.name}
                </div>
                {comment.author.isVerified && (
                  <svg
                    className="w-4 h-4 fill-blue-500"
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
                <div className="text-gray-500">
                  <RelativeDate date={comment.createdAt} isCompact={true} />
                </div>
              </div>
            </div>
            {comment.text && (
              <div
                className="overflow-hidden text-ellipsis max-h-14"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                }}
              >
                {comment.text}
              </div>
            )}
            {comment.imageId && (
              <img
                className="w-full max-w-[50px] max-h-[50px]"
                src={getImageUrl(comment.imageId)}
                alt="Изображение к комментарию"
              />
            )}
            {comment.post.title && (
              <div className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                {comment.post.title}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};
