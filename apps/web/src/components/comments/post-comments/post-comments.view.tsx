import { memo } from "react";

import { Card } from "../../card";
import { PluralForm } from "../../plural-form";
import { Spinner } from "../../spinner";

import { CommentList } from "./comment-list/comment-list";
import { EditCommentForm } from "./edit-comment-form";
import { usePostCommentsState } from "./post-comments.state";

export type Props = {
  postId: number;
};

export const PostComments = memo<Props>((props) => {
  const state = usePostCommentsState(props);
  return (
    <Card id="comments" className="relative flex flex-col w-full max-w-2xl">
      <Spinner isTranslucent={false} isSpinning={state.isLoading} />
      <div className="font-bold text-xl">
        {state.total}{" "}
        <PluralForm
          number={state.total}
          one="комментарий"
          few="комментария"
          many="комментариев"
        />
      </div>
      <div className="relative mt-3 flex flex-col gap-y-2">
        <CommentList state={state} comments={state.tree} />
        <EditCommentForm postId={props.postId} onSubmit={state.refetch} />
      </div>
    </Card>
  );
});

PostComments.displayName = "PostComments";
