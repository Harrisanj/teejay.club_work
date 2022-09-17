import { AppRouter, TPost } from "@teejay/api";

import { PostComments, NewComments } from "../../components/comments";
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
      post: TPost;
      comments: AppRouter["comments"]["getByPost"]["_def"]["_output_out"];
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
      const [post, comments] = await Promise.all([
        trpc.posts.getOne.query({ id }),
        trpc.comments.getByPost.query({ postId: id, take: 20 }),
      ]);
      return { props: { post, comments } };
    } catch (error) {
      console.error(error);
      return { notFound: true } as const;
    }
  }
);

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const PostPage: NextPage<Props> = ({ post, comments }) => {
  return (
    <Page title={post.title || `Пост от ${post.author.name}`} description="">
      <div className="md:max-w-2xl w-full md:mx-auto">
        <div className="flex flex-col items-center gap-y-4">
          <Post key={post.id} post={post} />
          <PostComments postId={post.id} comments={comments} />
        </div>
      </div>
      <NewComments />
    </Page>
  );
};

export default PostPage;
