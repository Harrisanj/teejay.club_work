import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { trpc } from "../../../utilities";
import { Card } from "../../card";
import { PluralForm } from "../../plural-form";
import { Spinner } from "../../spinner";

import { CommentList } from "./comment-list/comment-list";
import { NewCommentForm } from "./new-comment-form";

type Props = {
  postId: number;
};

export const PostComments = observer<Props>(({ postId }) => {
  const router = useRouter();
  const commentId = useMemo(() => {
    const string = router.query.comment;
    if (typeof string !== "string") {
      return undefined;
    }
    const number = +string;
    if (!Number.isSafeInteger(number)) {
      return undefined;
    }
    return number;
  }, [router]);

  const commentsQuery = trpc.comments.getByPost.useQuery(
    { postId, commentId },
    { refetchInterval: 5000 }
  );

  const [replyTo, setReplyTo] = useState<number>();
  const { total } = commentsQuery.data?.meta ?? { total: 0 };
  const comments = commentsQuery?.data?.data ?? [];
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
          comments={comments}
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
