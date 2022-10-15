import { AppRouter, TUser } from "@teejay/api";
import { format } from "date-fns";
import locale from "date-fns/locale/ru";
import { Fragment, useState } from "react";

import { AvatarChanger } from "../../components/avatar-changer";
import { Card } from "../../components/card";
import { NewComments } from "../../components/comments";
import { CommentVote } from "../../components/comments/comment-vote";
import { Link } from "../../components/link";
import { Page } from "../../components/page";
import { Post } from "../../components/posts";
import { RelativeDate } from "../../components/relative-date";
import { useInfiniteScroll } from "../../hooks";
import {
  withInitialData,
  getAvatarUrl,
  createServerSideTRPC,
  trpc,
  classNames,
  getImageUrl,
} from "../../utilities";

import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

export const getServerSideProps = withInitialData(
  async (
    context: GetServerSidePropsContext
  ): Promise<
    GetServerSidePropsResult<{
      currentUser: TUser | null;
      user: TUser;
      posts: AppRouter["posts"]["getNew"]["_def"]["_output_out"];
      comments: AppRouter["comments"]["getByAuthor"]["_def"]["_output_out"];
    }>
  > => {
    if (
      !context.params ||
      !context.params.id ||
      typeof context.params.id !== "string"
    ) {
      return { notFound: true };
    }

    const id = Number.parseInt(context.params.id, 10);
    if (Number.isNaN(id) || !Number.isSafeInteger(id)) {
      return { notFound: true } as const;
    }

    const trpc = createServerSideTRPC(context);

    try {
      const currentUser = await trpc.users.getMe.query().catch(() => null);
      const [user, posts, comments] = await Promise.all([
        trpc.users.getOne.query({ id }),
        trpc.posts.getNew.query({ authorId: id, take: 10 }),
        trpc.comments.getByAuthor.query({ authorId: id, take: 10 }),
      ]);

      return { props: { currentUser, user, posts, comments } };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  }
);

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const UserPage: NextPage<Props> = ({ currentUser, user, posts, comments }) => {
  const [tab, setTab] = useState("posts");

  const postsQuery = trpc.posts.getNew.useInfiniteQuery(
    { authorId: user.id, take: 10 },
    {
      initialData: {
        pages: [posts],
        pageParams: [],
      },
      getNextPageParam: (page) => page.meta.nextCursor,
    }
  );

  const commentsQuery = trpc.comments.getByAuthor.useInfiniteQuery(
    { authorId: user.id, take: 10 },
    {
      initialData: {
        pages: [comments],
        pageParams: [],
      },
      getNextPageParam: (page) => page.meta.nextCursor,
    }
  );

  useInfiniteScroll(
    postsQuery.isFetching,
    postsQuery.hasNextPage,
    postsQuery.fetchNextPage
  );

  useInfiniteScroll(
    commentsQuery.isFetching,
    commentsQuery.hasNextPage,
    commentsQuery.fetchNextPage
  );

  const postPages = postsQuery.data?.pages ?? [];
  const commentPages = commentsQuery.data?.pages ?? [];

  return (
    <Page title={`${user.name} — член клуба TeeJay`} description="">
      <div className="w-full flex flex-col gap-y-4">
        <Card className="md:max-w-2xl w-full md:mx-auto">
          <div className="flex flex-col gap-y-4 content">
            <div className="flex flex-row gap-x-4">
              {currentUser?.id === user.id ? (
                <AvatarChanger user={currentUser} />
              ) : (
                <img
                  className="w-32 h-32 rounded"
                  src={getAvatarUrl(user.avatarId)}
                  alt={user.name}
                />
              )}
              <div className="flex flex-col gap-y-2 justify-end">
                {user.blockedAt && (
                  <p className="text-red-500 font-medium">
                    Пользователь заблокирован.
                  </p>
                )}
                <h1 className="flex flex-row items-center !text-4xl">
                  {user.name}{" "}
                  {user.isVerified && (
                    <svg
                      className="ml-1 w-8 h-8 fill-blue-500"
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
                </h1>
                <p>
                  Член клуба с{" "}
                  {format(user.createdAt, "d LLL yyyy", { locale })}
                </p>
              </div>
            </div>
            <div className="flex flex-row -mb-4">
              <button
                className={classNames("px-3 py-2 border-b-2", {
                  "border-b-orange-500": tab === "posts",
                })}
                onClick={() => setTab("posts")}
              >
                Посты
              </button>
              <button
                className={classNames("px-3 py-2 border-b-2", {
                  "border-b-orange-500": tab === "comments",
                })}
                onClick={() => setTab("comments")}
              >
                Комментарии
              </button>
            </div>
          </div>
        </Card>

        {tab === "posts" &&
          postPages.map((page, i) => (
            <Fragment key={i}>
              {page.data.map((post) => (
                <Post
                  key={post.id}
                  className="md:max-w-2xl w-full md:mx-auto"
                  post={post}
                  isPreview={true}
                />
              ))}
            </Fragment>
          ))}

        {tab === "comments" &&
          commentPages.map((page, i) => (
            <Fragment key={i}>
              {page.data.map((comment) => (
                <Card
                  key={comment.id}
                  className="md:max-w-2xl w-full md:mx-auto flex flex-col gap-y-1"
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
                      </div>
                      <div className="flex flex-row items-center gap-x-1">
                        <Link
                          scroll={false}
                          href={`/posts/${comment.postId}?comment=${comment.id}`}
                          className="text-xs text-gray-500"
                        >
                          <RelativeDate date={new Date(comment.createdAt)} />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {comment.text && (
                    <div className="whitespace-pre-line break-words">
                      {comment.text}
                    </div>
                  )}
                  {comment.imageId && (
                    <div className="flex flex-row">
                      <a
                        href={getImageUrl(comment.imageId)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          className="w-full max-w-[400px] max-h-[300px]"
                          src={getImageUrl(comment.imageId)}
                          alt="Изображение к комментарию"
                        />
                      </a>
                    </div>
                  )}
                  <div className="flex flex-row items-end gap-x-1">
                    <div className="ml-auto">
                      <CommentVote comment={comment} />
                    </div>
                  </div>
                </Card>
              ))}
            </Fragment>
          ))}
      </div>
      <NewComments />
    </Page>
  );
};

export default UserPage;
