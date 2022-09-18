import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, InboxIcon } from "@heroicons/react/24/outline";
import { AppRouter, getTopPostsInput } from "@teejay/api";
import { GetServerSidePropsResult, InferGetServerSidePropsType } from "next";
import { Fragment } from "react";

import { NewComments } from "../../components/comments";
import { Link } from "../../components/link";
import { Page } from "../../components/page";
import { Post } from "../../components/posts";
import { useInfiniteScroll } from "../../hooks";
import {
  classNames,
  createServerSideTRPC,
  trpc,
  withInitialData,
} from "../../utilities";

export const getServerSideProps = withInitialData(
  async (
    context
  ): Promise<
    GetServerSidePropsResult<{
      interval: AppRouter["posts"]["getTop"]["_def"]["_input_out"]["interval"];
      posts: AppRouter["posts"]["getTop"]["_def"]["_output_out"];
    }>
  > => {
    let { interval } = context.params ?? {};
    if (typeof interval !== "string") {
      interval = "today";
    }

    const input = getTopPostsInput.safeParse({
      interval,
      take: 10,
    });
    if (!input.success) {
      console.error(input.error);
      return { notFound: true };
    }

    const trpc = createServerSideTRPC(context);
    const posts = await trpc.posts.getTop.query(input.data);
    return {
      props: {
        interval: input.data.interval,
        posts,
      },
    };
  }
);

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const intervalMap = {
  today: "Сегодня",
  day: "Сутки",
  week: "Неделя",
  month: "Месяц",
  year: "Год",
};

export default function Top({ interval, posts }: Props) {
  const postsQuery = trpc.posts.getTop.useInfiniteQuery(
    { interval, take: 10 },
    {
      initialData: {
        pages: [posts],
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

  if (!postsQuery.data) {
    return null;
  }

  const { pages } = postsQuery.data;
  return (
    <Page title="Популярное в клубе TeeJay">
      <div className="md:max-w-2xl w-full md:mx-auto">
        <div className="flex flex-col gap-y-4 md:mr-4 xl:mr-0">
          <div className="relative -my-2">
            <Menu>
              <Menu.Button>
                <div className="flex flex-row items-center">
                  <div className="px-4 py-2 flex flex-row gap-x-1 items-center leading-1 text-sm cursor-pointer">
                    <div>{intervalMap[interval]}</div>
                    <ChevronDownIcon
                      className="w-3 h-3 stroke-black"
                      strokeWidth={2}
                    />
                  </div>
                </div>
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
                    "absolute left-0 origin-top-left mt-2 w-56 max-h-56 z-10",
                    "bg-white shadow-lg ring-1 ring-amber-500 ring-opacity-50 rounded-md",
                    "overflow-auto focus:outline-none"
                  )}
                >
                  {Object.entries(intervalMap).map(([value, label]) => (
                    <Menu.Item
                      key={value}
                      as={Link}
                      href={`/top/${value}`}
                      className={classNames(
                        "flex flex-row gap-x-2 items-center px-4 py-2 text-sm",
                        "text-gray-900 hover:bg-gray-100 cursor-pointer"
                      )}
                    >
                      {label}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          {!pages[0]?.data?.length && (
            <div className="mt-16 flex flex-col items-center gap-y-4">
              <InboxIcon className="w-12 h-12" strokeWidth={0.75} />
              Постов за этот временной промежуток нет.
            </div>
          )}
          {pages.map((page, i) => (
            <Fragment key={i}>
              {page.data.map((post) => (
                <Post key={post.id} post={post} isPreview={true} />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <NewComments />
    </Page>
  );
}
