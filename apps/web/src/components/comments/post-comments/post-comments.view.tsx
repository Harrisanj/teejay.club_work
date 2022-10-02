import { observer } from "mobx-react-lite";

import { Card } from "../../card";
import { PluralForm } from "../../plural-form";
import { Spinner } from "../../spinner";

import { CommentList } from "./comment-list/comment-list";
import { EditCommentForm } from "./edit-comment-form";
import { useScrollToComment } from "./hooks";
import { PostCommentsState } from "./post-comments.state";

type Props = {
  state: PostCommentsState;
};

export const PostCommentsView = observer<Props>(({ state }) => {
  useScrollToComment();
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
        <EditCommentForm postId={state.postId} onSubmit={state.fetch} />
      </div>
    </Card>
  );
});
