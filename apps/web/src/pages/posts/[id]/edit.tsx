import { AppRouter } from "@teejay/api";

import { Card } from "../../../components/card";
import { NewComments } from "../../../components/comments";
import { Page } from "../../../components/page";
import { EditPostForm } from "../../../components/posts";
import { createServerSideTRPC, withInitialData } from "../../../utilities";

import type { NextPage } from "next";

export const getServerSideProps = withInitialData(async (context) => {
  const trpc = createServerSideTRPC(context);
  try {
    if (typeof context.params?.id !== "string") {
      throw new Error("Invalid id");
    }
    const id = Number.parseInt(context.params.id, 10);
    const [user, post] = await Promise.all([
      trpc.users.getMe.query(),
      trpc.posts.getOne.query({ id }),
    ]);
    if (post.author.id !== user?.id) {
      throw new Error("Not allowed");
    }
    return { props: { post } };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
});

type Props = {
  post: AppRouter["posts"]["getOne"]["_def"]["_output_out"];
};

const EditPostPage: NextPage<Props> = ({ post }) => {
  return (
    <Page title="Редактирование поста — TeeJay" description="">
      <Card className="md:max-w-3xl w-full md:mx-auto">
        <EditPostForm post={post} />
      </Card>
      <NewComments />
    </Page>
  );
};

export default EditPostPage;
