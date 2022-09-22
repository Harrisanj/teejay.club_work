import { memo, useEffect, useMemo } from "react";

import { useClientSideTRPC } from "../../../utilities";

import { PostCommentsState } from "./post-comments.state";
import { PostCommentsView } from "./post-comments.view";

type Props = {
  postId: number;
};

export const PostComments = memo<Props>(({ postId }) => {
  const trpc = useClientSideTRPC();
  const state = useMemo(
    () => new PostCommentsState(trpc, postId),
    [trpc, postId]
  );

  useEffect(() => {
    state.onMount();
    return () => {
      state.onUnmount();
    };
  }, [state]);

  return <PostCommentsView state={state} />;
});

PostComments.displayName = "PostComments";
