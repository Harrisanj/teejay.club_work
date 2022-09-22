import { Card } from "../../components/card";
import { NewComments } from "../../components/comments";
import { Page } from "../../components/page";
import { NewPostForm } from "../../components/posts";
import { createServerSideTRPC, withInitialData } from "../../utilities";

import type { NextPage } from "next";

export const getServerSideProps = withInitialData(async (context) => {
  const trpc = createServerSideTRPC(context);
  try {
    await trpc.users.getMe.query();
    return { props: {} };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
});

type Props = void;

const NewPostPage: NextPage<Props> = () => {
  return (
    <Page title="Новый пост в клуб TeeJay" description="">
      <Card className="md:max-w-3xl w-full md:mx-auto">
        <NewPostForm />
      </Card>
      <NewComments />
    </Page>
  );
};

export default NewPostPage;
