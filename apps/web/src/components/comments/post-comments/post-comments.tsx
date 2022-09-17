import { observer } from "mobx-react-lite";
import { useState } from "react";

import { trpc } from "../../../utilities";
import { Card } from "../../card";
import { PluralForm } from "../../plural-form";
import { Spinner } from "../../spinner";

import { CommentList } from "./comment-list/comment-list";
import { NewCommentForm } from "./new-comment-form";
import { TComment } from "./type";

type Props = {
  postId: number;

  comments: {
    meta: {
      total: number;
    };
    data: TComment[];
  };
};

export const PostComments = observer<Props>(({ postId, comments }) => {
  const commentsQuery = trpc.comments.getByPost.useQuery(
    {
      postId,
      take: 20,
    },
    {
      initialData: comments,
      refetchInterval: 5000,
    }
  );

  const { total } = commentsQuery.data?.meta ?? { total: 0 };

  const [replyTo, setReplyTo] = useState<number>();

  return (
    <Card id="comments" className="relative flex flex-col w-full max-w-2xl">
      <div className="font-bold text-xl">
        {total}{" "}
        <PluralForm
          number={total}
          one="комментарий"
          few="комментария"
          many="комментариев"
        />
      </div>
      <div className="relative mt-3 flex flex-col gap-y-2">
        <Spinner isSpinning={commentsQuery.isLoading} />
        <CommentList
          comments={commentsQuery?.data?.data ?? []}
          replyTo={replyTo}
          onReplyToChange={setReplyTo}
        />
        <NewCommentForm
          postId={postId}
          onCreate={() => commentsQuery.refetch()}
        />
      </div>
    </Card>
  );
});
