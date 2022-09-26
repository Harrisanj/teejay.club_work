import { AppRouter } from "@teejay/api";
import Image from "next/image";

import { Card } from "../../components/card";
import { NewComments } from "../../components/comments";
import { Page } from "../../components/page";
import { Post } from "../../components/posts";
import { createServerSideTRPC, withInitialData } from "../../utilities";

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
      subsite: AppRouter["subsites"]["getOne"]["_def"]["_output_out"];
      posts: AppRouter["posts"]["getTop"]["_def"]["_output_out"];
    }>
  > => {
    if (
      !context.params ||
      typeof context.params.slug !== "string" ||
      context.params.slug.length !== 0
    ) {
      return { notFound: true };
    }

    const slug = context.params.slug.trim();
    const trpc = createServerSideTRPC(context);

    try {
      const subsite = await trpc.subsites.getOne.query({ slug });
      const posts = await trpc.posts.getTop.query({
        interval: "week",
        subsiteId: subsite.id,
      });
      return { props: { subsite, posts } };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  }
);

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const UserPage: NextPage<Props> = ({ subsite, posts }) => {
  return (
    <Page title={`${subsite.name} — подсайт клуба TeeJay`} description="">
      <div className="w-full flex flex-col gap-y-4">
        <Card className="md:max-w-2xl w-full md:mx-auto">
          <div className="flex flex-col gap-y-4 content">
            <div className="flex flex-row gap-x-4">
              <div className="w-32 h-32 min-w-[8rem] rounded">
                <Image
                  width={128}
                  height={128}
                  src={subsite.avatar}
                  alt={subsite.name}
                />
              </div>
              <div className="flex flex-col gap-y-2 justify-end">
                <h1 className="flex flex-row items-center !text-4xl">
                  {subsite.name}
                </h1>
                <p>{subsite.description}</p>
              </div>
            </div>
          </div>
        </Card>
        {posts.data.map((post) => (
          <Post
            key={post.id}
            className="md:max-w-2xl w-full md:mx-auto"
            post={post}
            isPreview={true}
          />
        ))}
      </div>
      <NewComments />
    </Page>
  );
};

export default UserPage;
